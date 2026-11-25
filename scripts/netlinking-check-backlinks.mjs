#!/usr/bin/env node
/**
 * netlinking-check-backlinks.mjs — vérificateur de backlinks de la campagne Parrainio.
 *
 * Principe : on ne déclare un backlink que si une balise <a href="…"> pointant
 * réellement vers parrainio.fr a été lue dans le HTML d'une page publique.
 * Le script conserve un état initial (baseline), un historique d'observations,
 * et n'écrit dans `3-backlinks-verifies.csv` que les liens constatés.
 *
 * Usages :
 *   node scripts/netlinking-check-backlinks.mjs --dry-run
 *   node scripts/netlinking-check-backlinks.mjs --limit 3
 *   node scripts/netlinking-check-backlinks.mjs
 *   node scripts/netlinking-check-backlinks.mjs --all --max-pages 12
 *   node scripts/netlinking-check-backlinks.mjs --init-baseline --limit 5
 *
 * Options :
 *   --dry-run          n'écrit rien, n'interroge rien : liste les contrôles prévus
 *   --limit N          limite le nombre de domaines traités
 *   --all              inclut les domaines non contactés (hors exclus/oppositions)
 *   --max-pages N      pages maximum par domaine (défaut 8)
 *   --concurrency N    domaines traités en parallèle (défaut 4)
 *   --timeout MS       délai par requête (défaut 15000)
 *   --init-baseline    (re)crée l'état initial à la date du jour, sans écraser l'existant
 *   --no-resolve       ne suit pas les redirections des liens intermédiaires
 *   --no-robots        ignore robots.txt (déconseillé)
 *   --json <path>      écrit le rapport machine en JSON
 *   --quiet            n'affiche que le résumé
 *
 * Aucune protection n'est contournée : 403, 429, 503 et pages de challenge sont
 * classés « bloqué » et n'écrasent jamais une observation valide antérieure.
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/* ------------------------------------------------------------------ constantes */

export const TARGET_HOSTS = new Set(["parrainio.fr", "www.parrainio.fr"]);
export const TARGET_PAGE = "https://parrainio.fr/classement-primes-parrainage";

export const DEFAULT_PATHS = {
  registry: "docs/netlinking/base-prospection.csv",
  contacts: "docs/netlinking/contacts-email.csv",
  drafts: "docs/netlinking/brouillons-email.csv",
  actions: "docs/netlinking/actions-manuelles.csv",
  relances: "docs/netlinking/relances-email.csv",
  oppositions: "docs/netlinking/oppositions.csv",
  baseline: "docs/netlinking/donnees/backlinks-baseline.jsonl",
  observations: "docs/netlinking/donnees/backlinks-observations.jsonl",
  verifiedCsv: "docs/netlinking/3-backlinks-verifies.csv",
  publicationPages: "docs/netlinking/donnees/pages-publication.jsonl",
};

/** Colonnes historiques de `3-backlinks-verifies.csv` (jamais renommées). */
export const VERIFIED_HEADER = [
  "Domaine source",
  "URL source",
  "URL destination",
  "Ancre",
  "Attribut SEO",
  "Date de vérification",
  "Preuve",
  "destination_finale",
  "rel_detail",
  "statut_origine",
  "http_statut",
  "premiere_decouverte",
  "preuve_html",
];

const CONTACTED_STATUS = /soumis|E-mail envoyé|Réponse reçue|Publication promise/i;
const PENDING_STATUS = /Qualifié, à contacter|Brouillon prêt|Tentative non confirmée/i;
const EXCLUDED_STATUS = /Exclu|Opposition/i;
const BLOCK_STATUSES = new Set([401, 403, 405, 406, 409, 429, 451, 503]);
const CHALLENGE_MARKERS = [
  "just a moment",
  "cf-chl",
  "attention required",
  "enable javascript and cookies",
  "checking your browser",
  "captcha-delivery",
  "datadome",
];
const RELEVANT_PATH = /(parrain|prime|bienvenue|ressource|partenaire|comparatif|avis|guide|article|blog|recommand|outil|liens)/i;
const RELEVANT_ANCHOR = /(parrain|prime|ressource|partenaire|comparatif|lien|guide|outil|recommand)/i;

/* ---------------------------------------------------------------------- utils */

/** Horodatage ISO sans millisecondes, fuseau UTC. */
export function isoNow(date = new Date()) {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

export function normalizeDomain(raw) {
  return String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, "")
    .split("/")[0]
    .split("?")[0]
    .replace(/:\d+$/, "")
    .replace(/^www\./, "")
    .replace(/\.$/, "");
}

/**
 * Normalise une URL pour comparaison. On garde le chemin tel quel (sensible à la
 * casse), on retire le slash final, le fragment et les paramètres de tracking.
 */
export function normalizeUrl(raw, base) {
  let url;
  try {
    url = new URL(String(raw ?? "").trim(), base);
  } catch {
    return null;
  }
  if (!/^https?:$/.test(url.protocol)) return null;
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  // Le chemin reste sensible à la casse : deux pages distinctes ne doivent pas
  // être confondues. Seuls l'hôte et le schéma sont normalisés.
  let pathname = url.pathname.replace(/\/+$/, "");
  const search = url.search ? url.search.toLowerCase() : "";
  const full = `https://${host}${pathname}${search}`;
  return full === `https://${host}` ? full : full;
}

/**
 * Nettoie une URL candidate telle qu'elle figure dans le registre : les colonnes
 * `page` contiennent parfois une note libre après l'URL ("…/contact (page
 * invitant à proposer un partenariat)" ou "…/mentions-legales-cgu/%20(adresse…)").
 * Sans ce nettoyage, l'outil fabrique une URL invalide et conclut à tort à une
 * page absente.
 */
export function sanitizeCandidateUrl(raw) {
  const text = String(raw ?? "").trim();
  const start = text.search(/https?:\/\//i);
  if (start === -1) return "";
  let url = text.slice(start);
  const annotation = url.search(/%20\(|\s\(/);
  if (annotation !== -1) url = url.slice(0, annotation);
  url = url.replace(/^(?:%20)+/i, "").replace(/(?:%20)+$/i, "").replace(/[\s,;]+$/, "");
  try {
    const parsed = new URL(url);
    if (!/^https?:$/.test(parsed.protocol) || !parsed.hostname.includes(".")) return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

const SHORTENER_HOSTS = new Set([
  "bit.ly",
  "t.co",
  "tinyurl.com",
  "goo.gl",
  "ow.ly",
  "lnkd.in",
  "buff.ly",
  "rebrand.ly",
  "cutt.ly",
]);

/**
 * Une URL de publication annoncée par e-mail peut être un raccourcisseur, un
 * domaine punycode ou une adresse IP : on ne l'ouvre pas aveuglément.
 */
export function isSuspectPublicationUrl(raw) {
  try {
    const url = new URL(String(raw ?? ""));
    const host = url.hostname.toLowerCase().replace(/\.$/, "");
    if (!/^https?:$/.test(url.protocol)) return true;
    return SHORTENER_HOSTS.has(host) || host.startsWith("xn--") || /^\d+\.\d+\.\d+\.\d+$/.test(host);
  } catch {
    return true;
  }
}

/**
 * Hôtes externes liés depuis une page : permet de distinguer « page sans aucun
 * lien » de « page qui renvoie vers un autre domaine que Parrainio ».
 */
export function externalLinkHosts(html, pageUrl, max = 5) {
  const hosts = new Set();
  let ownHost = "";
  try {
    ownHost = normalizeDomain(new URL(pageUrl).hostname);
  } catch {
    /* URL invalide : aucun hôte de référence */
  }
  for (const m of String(html ?? "").matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
    try {
      const url = new URL(m[1], pageUrl);
      if (!/^https?:$/.test(url.protocol)) continue;
      const host = normalizeDomain(url.hostname);
      if (!host || TARGET_HOSTS.has(host) || host === ownHost) continue;
      hosts.add(host);
    } catch {
      /* href invalide */
    }
  }
  return [...hosts].slice(0, max);
}

export function isTargetUrl(raw, base) {
  try {
    const url = new URL(raw, base);
    return TARGET_HOSTS.has(url.hostname.toLowerCase().replace(/\.$/, ""));
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ CSV */

export function parseCsv(content) {
  const rows = [];
  let row = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i];
    if (quoted) {
      if (ch === '"' && content[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ";") {
      row.push(cur);
      cur = "";
    } else if (ch === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else if (ch !== "\r") cur += ch;
  }
  if (cur || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

export function csvCell(value) {
  const s = String(value ?? "").replace(/\r\n/g, "\n");
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function writeCsv(file, header, rows) {
  const body = rows.map((r) => r.map(csvCell).join(";")).join("\n");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${header.map(csvCell).join(";")}\n${body}${rows.length ? "\n" : ""}`);
}

/** Lecture d'un CSV en tableau d'objets, avec en-tête conservé. */
export function readCsvObjects(file) {
  if (!fs.existsSync(file)) return { header: [], rows: [] };
  const parsed = parseCsv(fs.readFileSync(file, "utf8"));
  if (!parsed.length) return { header: [], rows: [] };
  const [header, ...rows] = parsed;
  return { header, rows: rows.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""]))) };
}

/* -------------------------------------------------------------- robots.txt */

/**
 * Analyse robots.txt : renvoie des règles {allow, pattern} pour l'agent visé.
 * Gestion simplifiée mais correcte des cas courants : groupes User-agent,
 * Allow/Disallow, jokers `*`, `$` en fin de motif, règle la plus longue gagne.
 */
export function parseRobots(text, uaToken = "parrainiobot") {
  const lines = String(text ?? "").split(/\r?\n/);
  const groups = [];
  let current = null;
  let collectingAgents = false;

  for (const rawLine of lines) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();

    if (key === "user-agent") {
      if (!collectingAgents) {
        current = { agents: [], rules: [] };
        groups.push(current);
        collectingAgents = true;
      }
      current.agents.push(value.toLowerCase());
    } else if (key === "allow" || key === "disallow") {
      if (!current) continue;
      collectingAgents = false;
      if (value) current.rules.push({ allow: key === "allow", pattern: value });
    } else {
      collectingAgents = false;
    }
  }

  const applies = groups.filter(
    (g) => g.agents.includes("*") || g.agents.some((a) => a && uaToken.includes(a)),
  );
  // Le groupe nommé précisément prime sur le générique.
  const named = applies.filter((g) => g.agents.some((a) => a !== "*" && uaToken.includes(a)));
  const chosen = named.length ? named : applies;
  return chosen.flatMap((g) => g.rules);
}

export function robotsAllows(rules, url) {
  if (!rules || !rules.length) return true;
  let pathname;
  try {
    const u = new URL(url);
    pathname = `${u.pathname}${u.search}`;
  } catch {
    return true;
  }
  let best = null;
  for (const rule of rules) {
    const pattern = rule.pattern;
    const anchored = pattern.endsWith("$");
    const body = (anchored ? pattern.slice(0, -1) : pattern).replace(/[.+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`^${body.replace(/\*/g, ".*")}${anchored ? "$" : ""}`);
    if (!regex.test(pathname)) continue;
    const length = pattern.length;
    if (!best || length > best.length || (length === best.length && rule.allow)) {
      best = { allow: rule.allow, length };
    }
  }
  return best ? best.allow : true;
}

/* --------------------------------------------------------- sélection des liens */

/**
 * Repère les liens susceptibles d'être des redirections vers Parrainio :
 * raccourcisseurs connus, URL contenant une destination en paramètre, ou
 * chemins de sortie internes. Aucune requête n'est faite ici.
 */
export function detectRedirectCandidates(html, pageUrl) {
  const SHORTENERS = /(^|\.)(bit\.ly|tinyurl\.com|cutt\.ly|t\.co|goo\.gl|ow\.ly|rb\.gy|shorturl\.at|rebrand\.ly|lnkd\.in)$/i;
  const out = new Set();
  for (const m of String(html ?? "").matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)) {
    let url;
    try {
      url = new URL(decodeHtmlEntities(m[1]), pageUrl);
    } catch {
      continue;
    }
    if (!/^https?:$/.test(url.protocol)) continue;
    if (isTargetUrl(url.toString())) continue;
    const looksLikeRedirect =
      SHORTENERS.test(url.hostname) ||
      /(redirect|redir|out|go|link|url|target)=https?%3a|(redirect|redir|out|go|link|url|target)=https?:/i.test(url.search) ||
      /\/(redirect|redirection|out|go|away|link-out)(\/|\?|-|$)/i.test(url.pathname);
    if (looksLikeRedirect) out.add(url.toString());
  }
  return [...out].slice(0, 5);
}

/** Extrait les balises <a> pointant vers Parrainio (hôtes exacts uniquement). */
export function detectParrainioLinks(html, pageUrl) {
  const links = [];
  const seen = new Set();
  const re = /<a\b([^>]*)>([\s\S]{0,300}?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    const rawHref = attrs.match(/href\s*=\s*["']([^"']*)["']/i)?.[1];
    if (!rawHref) continue;

    let absolute;
    try {
      absolute = new URL(decodeHtmlEntities(rawHref), pageUrl).toString();
    } catch {
      continue;
    }
    if (!/^https?:/i.test(absolute)) continue;
    if (!isTargetUrl(absolute)) continue;

    const normalized = normalizeUrl(absolute);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);

    const relRaw = attrs.match(/\brel\s*=\s*["']([^"']*)["']/i)?.[1] ?? "";
    const rel = relRaw.trim().toLowerCase();
    links.push({
      pageUrl,
      href: absolute,
      destination: normalized,
      anchor: decodeHtmlEntities(m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()).slice(0, 160),
      rel: rel || "(absent)",
      nofollow: /\bnofollow\b/.test(rel),
      sponsored: /\bsponsored\b/.test(rel),
      ugc: /\bugc\b/.test(rel),
      snippet: m[0].replace(/\s+/g, " ").slice(0, 300),
      isInternal: isSamePage(absolute, pageUrl),
    });
  }
  return links;
}

function isSamePage(a, b) {
  try {
    return normalizeUrl(a) === normalizeUrl(b);
  } catch {
    return false;
  }
}

export function decodeHtmlEntities(value) {
  return String(value ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)));
}

/** Extrait les URL d'un sitemap XML (index ou urlset), borné. */
export function extractSitemapUrls(xml, limit = 200) {
  const urls = [];
  for (const m of String(xml ?? "").matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)) {
    const clean = decodeHtmlEntities(m[1]).trim();
    if (/^https?:\/\//i.test(clean) && !urls.includes(clean)) urls.push(clean);
    if (urls.length >= limit) break;
  }
  return urls;
}

/** Classe et limite les liens internes susceptibles de contenir une mention. */
export function rankInternalLinks(html, pageUrl, max = 5) {
  const pageHost = (() => {
    try {
      return new URL(pageUrl).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  })();
  const seen = new Map();
  for (const m of String(html ?? "").matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]{0,120}?)<\/a>/gi)) {
    let url;
    try {
      url = new URL(m[1], pageUrl);
    } catch {
      continue;
    }
    if (!/^https?:$/.test(url.protocol)) continue;
    if (url.hostname.replace(/^www\./, "") !== pageHost) continue;
    const label = decodeHtmlEntities(m[2].replace(/<[^>]+>/g, " ")).trim();
    let score = 0;
    if (RELEVANT_PATH.test(url.pathname)) score += 3;
    if (RELEVANT_ANCHOR.test(label)) score += 2;
    if (score === 0) continue;
    const key = normalizeUrl(url.toString());
    if (!key) continue;
    if (!seen.has(key) || seen.get(key).score < score) seen.set(key, { url: url.toString(), score, label });
  }
  return [...seen.values()].sort((a, b) => b.score - a.score).slice(0, max).map((v) => v.url);
}

/* ------------------------------------------------------------- comparaison */

/**
 * Compare l'observation courante d'une page au dernier contrôle connu.
 * kinds : present | absent | blocked | unreachable
 */
export function classifyObservation(previous, current) {
  const prevKind = previous?.kind ?? null;
  if (current.kind === "blocked") return { state: "bloque", indeterminate: true };
  if (current.kind === "unreachable") return { state: "inaccessible", indeterminate: true };
  if (current.kind === "absent") {
    return { state: prevKind === "present" ? "disparu" : "sans_lien", indeterminate: false };
  }
  if (prevKind !== "present") return { state: "nouveau", indeterminate: false };
  const same =
    JSON.stringify(previous.links ?? []) === JSON.stringify(current.links ?? []);
  return { state: same ? "inchange" : "modifie", indeterminate: false };
}

/** Clé stable d'une observation de page. */
export function pageKey(domain, pageUrl) {
  return `${normalizeDomain(domain)}|${normalizeUrl(pageUrl) ?? String(pageUrl)}`;
}

/* ------------------------------------------------------------------- réseau */

const UA = "Mozilla/5.0 (compatible; ParrainioBot/1.0; +https://parrainio.fr) backlink-check";
const MAX_BYTES = 900_000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function defaultFetch(url, { timeout = 15_000 } = {}) {
  const res = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(timeout),
    headers: {
      "user-agent": UA,
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "fr-FR,fr;q=0.9,en;q=0.5",
    },
  });
  const buf = await res.arrayBuffer();
  const text = new TextDecoder("utf-8").decode(buf.slice(0, MAX_BYTES));
  return { status: res.status, finalUrl: res.url || url, text, contentType: res.headers.get("content-type") ?? "" };
}

function looksBlocked(status, text) {
  if (BLOCK_STATUSES.has(status)) return true;
  if (status === 200) {
    const head = text.slice(0, 4000).toLowerCase();
    return CHALLENGE_MARKERS.some((marker) => head.includes(marker));
  }
  return false;
}

async function fetchOnce(fetchImpl, url, timeout) {
  try {
    const res = await fetchImpl(url, { timeout });
    return { ok: !(res.status >= 400), status: res.status, finalUrl: res.finalUrl, text: res.text, contentType: res.contentType, error: null };
  } catch (err) {
    return { ok: false, status: 0, finalUrl: url, text: "", contentType: "", error: String(err?.message ?? err) };
  }
}

/* ------------------------------------------------------------------ campagne */

/**
 * Charge les domaines de la campagne depuis tous les fichiers de suivi.
 * Le registre fait foi pour le statut et la page connue ; les autres fichiers
 * servent à ne rien oublier et à dédupliquer par domaine.
 */
export function loadCampaign(paths, { includeAll = false } = {}) {
  const registry = readCsvObjects(paths.registry);
  const byDomain = new Map();

  for (const row of registry.rows) {
    const domain = normalizeDomain(row.domaine);
    if (!domain) continue;
    byDomain.set(domain, {
      domain,
      name: row.nom ?? "",
      status: row.statut ?? "",
      page: row.page ?? "",
      contactedAt: row.contacte_le ?? "",
      discoveredAt: row.decouvert_le ?? "",
      backlinkUrl: row.backlink_url ?? "",
      sources: new Set(["base-prospection.csv"]),
    });
  }

  const extraFiles = [
    ["contacts", paths.contacts, (r) => r.domaine],
    ["drafts", paths.drafts, (r) => r.domaine],
    ["actions", paths.actions, (r) => r.domaine],
    ["relances", paths.relances, (r) => r.domaine],
  ];
  for (const [, file, pick] of extraFiles) {
    if (!file || !fs.existsSync(file)) continue;
    for (const row of readCsvObjects(file).rows) {
      const domain = normalizeDomain(pick(row));
      if (!domain) continue;
      const label = path.basename(file);
      if (byDomain.has(domain)) byDomain.get(domain).sources.add(label);
      else
        byDomain.set(domain, {
          domain,
          name: row.nom ?? "",
          status: row.statut ?? "",
          page: "",
          contactedAt: "",
          discoveredAt: "",
          backlinkUrl: "",
          sources: new Set([label]),
        });
    }
  }

  const oppositionDomains = new Set(
    (fs.existsSync(paths.oppositions) ? readCsvObjects(paths.oppositions).rows : []).map((r) =>
      normalizeDomain(r.domaine),
    ),
  );

  const selected = [];
  for (const entry of byDomain.values()) {
    if (oppositionDomains.has(entry.domain)) continue;
    if (!includeAll && EXCLUDED_STATUS.test(entry.status)) continue;
    if (!includeAll && !CONTACTED_STATUS.test(entry.status) && !PENDING_STATUS.test(entry.status) && !entry.backlinkUrl) {
      continue;
    }
    selected.push(entry);
  }
  selected.sort((a, b) => a.domain.localeCompare(b.domain));
  return { all: byDomain, selected, oppositionDomains };
}

/* ------------------------------------------------------------------- plan */

async function fetchRobots(origin, fetchImpl, timeout) {
  const res = await fetchOnce(fetchImpl, `${origin}/robots.txt`, timeout);
  if (!res.ok || !res.text) return { rules: [], sitemaps: [] };
  const sitemaps = [...res.text.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((m) => m[1].trim());
  return { rules: parseRobots(res.text), sitemaps };
}

async function fetchSitemapUrls(origin, sitemaps, fetchImpl, timeout, max = 300) {
  const candidates = sitemaps.length ? sitemaps : [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`];
  const urls = [];
  for (const sitemap of candidates.slice(0, 3)) {
    const res = await fetchOnce(fetchImpl, sitemap, timeout);
    if (!res.ok || !res.text) continue;
    const found = extractSitemapUrls(res.text, max);
    // sitemapindex : on suit au plus deux sous-sitemaps
    if (/<sitemapindex/i.test(res.text) && found.length) {
      for (const child of found.slice(0, 2)) {
        const childRes = await fetchOnce(fetchImpl, child, timeout);
        if (childRes.ok) urls.push(...extractSitemapUrls(childRes.text, max));
      }
    } else {
      urls.push(...found);
    }
    if (urls.length) break;
  }
  return [...new Set(urls)];
}

/**
 * Construit la liste des pages à contrôler pour un domaine : page connue,
 * accueil, pages internes pertinentes puis entrées de sitemap filtrées.
 */
export async function planDomain(entry, { fetchImpl, timeout, maxPages, useRobots, onlyPublication = false }) {
  const origin = `https://${entry.domain}`;
  const planned = [];
  const add = (url, reason) => {
    const clean = sanitizeCandidateUrl(url);
    if (!clean) return;
    const normalized = normalizeUrl(clean);
    if (!normalized) return;
    if (planned.some((p) => normalizeUrl(p.url) === normalized)) return;
    planned.push({ url: clean, reason });
  };

  const robots = useRobots ? await fetchRobots(origin, fetchImpl, timeout) : { rules: [], sitemaps: [] };

  // Pages de publication annoncées par e-mail : prioritaires, car ce sont les
  // seules URL dont on sait qu'elles sont censées contenir le lien.
  for (const publication of entry.publicationPages ?? []) add(publication, "page de publication annoncée par e-mail");

  // Mode « page de publication » : on contrôle exactement ce qui a été annoncé,
  // sans disperser la vérification sur l'accueil ou le sitemap.
  if (onlyPublication) {
    const allowed = planned.filter((p) => !useRobots || robotsAllows(robots.rules, p.url));
    const skipped = planned.filter((p) => useRobots && !robotsAllows(robots.rules, p.url));
    return { planned: allowed.slice(0, maxPages), skipped, homeHtml: "", robotsRules: robots.rules };
  }

  if (entry.page) add(entry.page, "page enregistrée dans le registre");
  add(origin + "/", "accueil");

  // Pages internes repérées sur l'accueil (une seule requête, réutilisée).
  const home = await fetchOnce(fetchImpl, origin + "/", timeout);
  let homeHtml = "";
  if (home.ok && home.text) {
    homeHtml = home.text;
    for (const link of rankInternalLinks(homeHtml, home.finalUrl || origin, Math.min(4, maxPages - planned.length))) {
      add(link, "lien interne pertinent");
    }
  }

  if (planned.length < maxPages) {
    const sitemapUrls = await fetchSitemapUrls(origin, robots.sitemaps, fetchImpl, timeout);
    const relevant = sitemapUrls.filter((u) => RELEVANT_PATH.test(u) && !/\.(jpg|jpeg|png|pdf|xml)$/i.test(u));
    const rest = sitemapUrls.filter((u) => !relevant.includes(u));
    for (const url of [...relevant.slice(0, maxPages), ...rest.slice(0, 2)]) {
      if (planned.length >= maxPages) break;
      add(url, "sitemap");
    }
  }

  const allowed = planned.filter((p) => !useRobots || robotsAllows(robots.rules, p.url));
  const skipped = planned.filter((p) => useRobots && !robotsAllows(robots.rules, p.url));
  return { planned: allowed.slice(0, maxPages), skipped, homeHtml, robotsRules: robots.rules };
}

/* ---------------------------------------------------------------- exécution */

async function resolveDestination(href, fetchImpl, timeout) {
  const res = await fetchOnce(fetchImpl, href, timeout);
  if (!res.status) return { finalUrl: href, ok: false, status: 0, error: res.error };
  return { finalUrl: res.finalUrl, ok: true, status: res.status };
}

/**
 * Contrôle une page et renvoie une observation normalisée.
 */
export async function observePage(pageUrl, { fetchImpl, timeout = 15_000, useResolve = true }) {
  const res = await fetchOnce(fetchImpl, pageUrl, timeout);
  if (!res.status) {
    return { pageUrl, kind: "unreachable", status: 0, finalUrl: pageUrl, error: res.error, links: [] };
  }
  if (looksBlocked(res.status, res.text)) {
    return { pageUrl, kind: "blocked", status: res.status, finalUrl: res.finalUrl, error: null, links: [] };
  }
  if (res.status === 404 || res.status === 410) {
    return { pageUrl, kind: "unreachable", status: res.status, finalUrl: res.finalUrl, error: "page absente", links: [] };
  }

  let links = detectParrainioLinks(res.text, res.finalUrl || pageUrl);
  const externalHosts = externalLinkHosts(res.text, res.finalUrl || pageUrl);

  // Liens intermédiaires (raccourcisseurs, redirections internes) : on ne les
  // retient que s'ils aboutissent réellement sur Parrainio.
  if (useResolve) {
    for (const candidate of detectRedirectCandidates(res.text, res.finalUrl || pageUrl)) {
      const target = await resolveDestination(candidate, fetchImpl, timeout);
      if (!isTargetUrl(target.finalUrl)) continue;
      links.push({
        pageUrl,
        href: candidate,
        destination: normalizeUrl(target.finalUrl),
        destinationFinale: normalizeUrl(target.finalUrl),
        anchor: "(redirection)",
        rel: "(absent)",
        nofollow: false,
        sponsored: false,
        ugc: false,
        snippet: `<a href="${candidate}">…</a> → ${target.finalUrl}`.slice(0, 300),
        resolvedRedirect: true,
      });
    }
  }

  links.sort((a, b) => a.destination.localeCompare(b.destination));
  const fingerprint = links.map((l) => `${l.destination}|${l.anchor}|${l.rel}`);
  return {
    pageUrl,
    kind: links.length ? "present" : "absent",
    status: res.status,
    finalUrl: res.finalUrl,
    error: null,
    links,
    externalHosts,
    fingerprint,
  };
}

/** Pages de publication annoncées par e-mail, à contrôler en priorité. */
export function loadPublicationPages(file) {
  if (!file || !fs.existsSync(file)) return [];
  return readJsonl(file).filter((entry) => entry && entry.domain && entry.url && entry.status !== "rejete");
}

/** Lit un JSONL en ignorant les lignes illisibles. */
export function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line)];
      } catch {
        return [];
      }
    });
}

export function lastObservationByPage(observations) {
  const map = new Map();
  for (const obs of observations) {
    const key = pageKey(obs.domain, obs.pageUrl);
    const prev = map.get(key);
    if (!prev || String(obs.observedAt) >= String(prev.observedAt)) map.set(key, obs);
  }
  return map;
}

/** Détermine l'origine d'un lien constaté. */
export function linkOrigin({ baselineEntry, contactDate, baselineDate }) {
  if (!baselineEntry?.linkPresent) return "nouveau";
  if (contactDate && baselineDate && baselineDate.slice(0, 10) <= contactDate.slice(0, 10)) return "preexistant";
  return "indetermine";
}

/**
 * Fusionne les liens constatés dans le CSV de vérification.
 * Met à jour les lignes existantes (même domaine + page + destination), n'ajoute
 * jamais de doublon, et conserve les lignes historiques.
 */
export function upsertVerifiedRows(existingRows, entries) {
  const rows = existingRows.map((r) => ({ ...r }));
  let added = 0;
  let updated = 0;

  for (const entry of entries) {
    const index = rows.findIndex(
      (r) =>
        normalizeDomain(r["Domaine source"]) === normalizeDomain(entry.domain) &&
        (normalizeUrl(r["URL source"]) ?? r["URL source"]) === (normalizeUrl(entry.pageUrl) ?? entry.pageUrl) &&
        (normalizeUrl(r["URL destination"]) ?? r["URL destination"]) === entry.destination,
    );
    const row = {
      "Domaine source": entry.domain,
      "URL source": entry.pageUrl,
      "URL destination": entry.destination,
      Ancre: entry.anchor,
      "Attribut SEO": entry.rel,
      "Date de vérification": entry.checkedAt.slice(0, 10),
      Preuve: entry.snippet,
      destination_finale: entry.destinationFinale ?? entry.destination,
      rel_detail: entry.rel,
      statut_origine: entry.origin,
      http_statut: String(entry.httpStatus),
      premiere_decouverte: entry.firstSeen.slice(0, 10),
      preuve_html: entry.snippet,
    };
    if (index >= 0) {
      const previous = rows[index];
      rows[index] = { ...previous, ...row, premiere_decouverte: previous.premiere_decouverte || row.premiere_decouverte };
      updated += 1;
    } else {
      rows.push(row);
      added += 1;
    }
  }
  return { rows, added, updated };
}

function ensureVerifiedFile(file) {
  if (fs.existsSync(file)) {
    const parsed = parseCsv(fs.readFileSync(file, "utf8"));
    const header = parsed[0] ?? [];
    const missing = VERIFIED_HEADER.filter((h) => !header.includes(h));
    if (!missing.length) {
      return { header, rows: parsed.slice(1).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""]))), migrated: false };
    }
    // Migration douce : on conserve les colonnes historiques et on ajoute les nouvelles.
    const merged = [...header, ...missing];
    const rows = parsed.slice(1).map((r) => Object.fromEntries(merged.map((h) => [h, r[header.indexOf(h)] ?? ""])));
    return { header: merged, rows, migrated: true };
  }
  return { header: [...VERIFIED_HEADER], rows: [], migrated: true };
}

function writeVerifiedFile(file, header, rows) {
  writeCsv(file, header, rows.map((r) => header.map((h) => r[h] ?? "")));
}

/** Met à jour le registre : backlink_url, dernière vérif, statut si promesse tenue. */
export function updateRegistry(file, linksByDomain) {
  const parsed = parseCsv(fs.readFileSync(file, "utf8"));
  const [header, ...rows] = parsed;
  const idx = (name) => header.indexOf(name);
  let updated = 0;

  for (const row of rows) {
    const domain = normalizeDomain(row[idx("domaine")]);
    const link = linksByDomain.get(domain);
    if (!link) continue;
    const current = row[idx("backlink_url")];
    if (!current) {
      row[idx("backlink_url")] = link.destination;
      updated += 1;
    }
    const statut = row[idx("statut")];
    if (statut === "Publication promise, non vérifiée") {
      row[idx("statut")] = "Backlink publié et vérifié";
      updated += 1;
    }
    row[idx("derniere_verif")] = link.checkedAt.slice(0, 10);
  }

  if (updated) {
    const tmp = `${file}.tmp`;
    fs.writeFileSync(tmp, `${header.map(csvCell).join(";")}\n${rows.map((r) => r.map(csvCell).join(";")).join("\n")}\n`);
    fs.renameSync(tmp, file);
  }
  return updated;
}

/* ------------------------------------------------------------------- main */

export async function runCheck(options = {}) {
  const startedAt = new Date();
  const paths = { ...DEFAULT_PATHS, ...(options.paths ?? {}) };
  const opts = {
    dryRun: false,
    limit: 0,
    includeAll: false,
    maxPages: 8,
    concurrency: 4,
    timeout: 15_000,
    useResolve: true,
    useRobots: true,
    initBaseline: false,
    publicationOnly: false,
    quiet: false,
    json: null,
    ...options,
  };
  const fetchImpl = opts.fetchImpl ?? defaultFetch;
  const log = opts.log ?? ((...args) => console.log(...args));

  if (opts.initBaseline) {
    log(
      `[baseline] état initial constitué le ${isoNow()} : il ne précède pas la campagne ` +
        `et ne permet donc pas de distinguer un lien préexistant d'un lien récent par lui-même.`,
    );
  }

  const campaign = loadCampaign(paths, { includeAll: opts.includeAll });

  // Pages issues de la relève IMAP (`netlinking-sync-replies.mjs`). Une page
  // annoncée par un interlocuteur n'est pas un backlink : elle est seulement
  // priorisée dans le contrôle.
  const publicationByDomain = new Map();
  const suspectPublications = [];
  for (const entry of loadPublicationPages(paths.publicationPages)) {
    const domain = normalizeDomain(entry.domain);
    if (!domain) continue;
    const url = sanitizeCandidateUrl(entry.url);
    if (!url) continue;
    if (isSuspectPublicationUrl(url)) {
      // Ni raccourcisseur ni adresse IP : on consigne sans ouvrir.
      suspectPublications.push({ domain, url, status: "suspecte", note: "URL raccourcie, punycode ou IP : non ouverte" });
      continue;
    }
    const list = publicationByDomain.get(domain) ?? [];
    if (!list.includes(url)) list.push(url);
    publicationByDomain.set(domain, list);
  }
  for (const entry of campaign.selected) entry.publicationPages = publicationByDomain.get(entry.domain) ?? [];
  for (const [domain, urls] of publicationByDomain) {
    if (campaign.all.has(domain)) continue;
    const synthetic = {
      domain,
      name: "",
      status: "Publication annoncée par e-mail",
      page: "",
      contactedAt: "",
      discoveredAt: "",
      backlinkUrl: "",
      sources: new Set(["pages-publication.jsonl"]),
      publicationPages: urls,
    };
    campaign.all.set(domain, synthetic);
    campaign.selected.push(synthetic);
  }

  let candidates = opts.limit > 0 ? campaign.selected.slice(0, opts.limit) : campaign.selected;
  if (opts.publicationOnly) {
    candidates = candidates.filter((entry) => (entry.publicationPages ?? []).length > 0);
  }

  const baseline = readJsonl(paths.baseline);
  const observations = readJsonl(paths.observations);
  const previousByPage = lastObservationByPage(observations);
  const baselineByPage = new Map(baseline.map((b) => [pageKey(b.domain, b.pageUrl), b]));

  if (opts.dryRun) {
    log(
      `[dry-run] ${campaign.all.size} domaines au registre, ${candidates.length} candidat(s)` +
        `${opts.publicationOnly ? " (pages de publication uniquement)" : ""}.`,
    );
    for (const entry of candidates) {
      const plan = await planDomain(entry, {
        fetchImpl: async () => ({ status: 0, finalUrl: "", text: "", contentType: "" }),
        timeout: opts.timeout,
        maxPages: opts.maxPages,
        useRobots: false,
        useResolve: false,
      });
      log(`[dry-run] ${entry.domain} (${entry.status || "sans statut"}) → ${plan.planned.length} page(s) :`);
      for (const p of plan.planned) log(`   - ${p.url}  [${p.reason}]`);
    }
    log("[dry-run] Aucune requête réseau, aucun fichier écrit.");
    return { dryRun: true, candidates: candidates.length };
  }

  const report = {
    startedAt: isoNow(startedAt),
    registryDomains: campaign.all.size,
    candidates: candidates.length,
    pagesFetched: 0,
    pagesWithLink: 0,
    newLinks: [],
    knownLinks: [],
    disappeared: [],
    noLinkPages: 0,
    blockedOrUnreachable: 0,
    indeterminateDomains: [],
    preexisting: [],
    undetermined: [],
    pageResults: [],
    errors: [],
    publicationResults: suspectPublications.map((p) => ({ ...p, httpStatus: null, externalHosts: [], comparison: "non_controlee" })),
  };

  const writeObservations = [];
  const writeBaseline = [];
  const verifiedEntries = [];
  const bestLinkByDomain = new Map();

  let cursor = 0;
  async function worker() {
    while (cursor < candidates.length) {
      const entry = candidates[cursor++];
      let plan;
      try {          plan = await planDomain(entry, {
            fetchImpl,
            timeout: opts.timeout,
            maxPages: opts.maxPages,
            useRobots: opts.useRobots,
            onlyPublication: opts.publicationOnly,
          });
      } catch (err) {
        report.errors.push({ domain: entry.domain, stage: "plan", error: String(err?.message ?? err) });
        report.indeterminateDomains.push(entry.domain);
        continue;
      }

      let domainHasLink = false;
      let domainBlocked = false;

      for (const page of plan.planned) {
        let obs;
        try {
          obs = await observePage(page.url, {
            fetchImpl,
            timeout: opts.timeout,
            useResolve: opts.useResolve,
          });
        } catch (err) {
          obs = { pageUrl: page.url, kind: "unreachable", status: 0, links: [], error: String(err?.message ?? err) };
        }

        report.pagesFetched += obs.kind === "present" || obs.kind === "absent" ? 1 : 0;
        if (obs.kind === "blocked" || obs.kind === "unreachable") {
          report.blockedOrUnreachable += 1;
          if (obs.kind === "blocked") domainBlocked = true;
        }

        const previous = previousByPage.get(pageKey(entry.domain, page.url));
        const current = {
          domain: entry.domain,
          pageUrl: obs.finalUrl ?? page.url,
          kind: obs.kind,
          status: obs.status,
          links: (obs.links ?? []).map((l) => ({
            destination: l.destination,
            destinationFinale: l.destinationFinale ?? l.destination,
            anchor: l.anchor,
            rel: l.rel,
          })),
        };
        const comparison = classifyObservation(previous, current);

        const record = {
          observedAt: isoNow(),
          domain: entry.domain,
          pageUrl: current.pageUrl,
          requestedUrl: page.url,
          reason: page.reason,
          kind: obs.kind,
          httpStatus: obs.status,
          finalUrl: obs.finalUrl ?? page.url,
          linkPresent: obs.kind === "present",
          destination: current.links[0]?.destination ?? "",
          destinationFinale: current.links[0]?.destinationFinale ?? "",
          anchor: current.links[0]?.anchor ?? "",
          rel: current.links[0]?.rel ?? "",
          links: current.links,
          externalHosts: obs.externalHosts ?? [],
          fingerprint: obs.fingerprint ?? [],
          comparison: comparison.state,
          error: obs.error ?? null,
        };
        writeObservations.push(record);

        // Baseline : une seule ligne par page, jamais réécrite.
        const key = pageKey(entry.domain, current.pageUrl);
        if (!baselineByPage.has(key)) {
          const entryBaseline = {
            domain: entry.domain,
            pageUrl: current.pageUrl,
            checkedAt: record.observedAt,
            establishedAt: record.observedAt,
            linkPresent: record.linkPresent,
            destination: record.destination,
            destinationFinale: record.destinationFinale,
            anchor: record.anchor,
            rel: record.rel,
            httpStatus: record.httpStatus,
            fetchResult: obs.kind,
            error: record.error,
            note: "état constitué au premier contrôle de cette page ; ne précède pas la campagne",
          };
          writeBaseline.push(entryBaseline);
          baselineByPage.set(key, { ...entryBaseline, linkPresent: record.linkPresent });
        }

        if (opts.publicationOnly && (entry.publicationPages ?? []).includes(page.url)) {
          const external = obs.externalHosts ?? [];
          report.publicationResults.push({
            domain: entry.domain,
            url: page.url,
            finalUrl: obs.finalUrl ?? page.url,
            httpStatus: obs.status,
            status:
              obs.kind === "present"
                ? "lien Parrainio constaté"
                : obs.kind === "unreachable"
                  ? "inaccessible"
                  : obs.kind === "blocked"
                    ? "contrôle bloqué"
                    : external.length
                      ? "sans lien Parrainio (liens vers d'autres domaines)"
                      : "accessible sans lien",
            externalHosts: external,
            targetLinks: (obs.links ?? []).length,
            comparison: comparison.state,
            error: obs.error ?? null,
          });
        }

        if (comparison.state === "nouveau") report.newLinks.push(record);
        else if (comparison.state === "inchange") report.knownLinks.push(record);
        else if (comparison.state === "modifie") report.knownLinks.push(record);
        else if (comparison.state === "disparu") report.disappeared.push(record);
        else if (comparison.state === "sans_lien") report.noLinkPages += 1;
        else report.indeterminateDomains.push(entry.domain);

        if (obs.kind === "present" && obs.links.length) {
          domainHasLink = true;
          report.pagesWithLink += 1;
          for (const link of obs.links) {
            const baselineEntry = baselineByPage.get(key);
            const origin = linkOrigin({
              baselineEntry,
              contactDate: entry.contactedAt,
              baselineDate: baselineEntry?.establishedAt,
            });
            const firstSeen =
              observations.find((o) => pageKey(o.domain, o.pageUrl) === key && o.linkPresent)?.observedAt ??
              record.observedAt;
            verifiedEntries.push({
              domain: entry.domain,
              pageUrl: current.pageUrl,
              destination: link.destination,
              destinationFinale: link.destinationFinale ?? link.destination,
              anchor: link.anchor,
              rel: link.rel,
              checkedAt: record.observedAt,
              firstSeen,
              origin,
              httpStatus: record.httpStatus,
              snippet: link.snippet ?? "",
            });
            if (origin === "preexistant") report.preexisting.push(record);
            if (origin === "indetermine") report.undetermined.push(record);
          }
          if (!bestLinkByDomain.has(entry.domain)) bestLinkByDomain.set(entry.domain, verifiedEntries.at(-1));
        }

        await sleep(250 + Math.random() * 250);
      }

      if (!domainHasLink && domainBlocked && !report.indeterminateDomains.includes(entry.domain)) {
        report.indeterminateDomains.push(entry.domain);
      }
      if (!opts.quiet) {
        const mark = domainHasLink ? "LIEN" : domainBlocked ? "BLOQUÉ" : "aucun";
        log(`  ${mark.padEnd(7)} ${entry.domain}`);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, opts.concurrency) }, worker));

  // Écritures (jamais en dry-run).
  fs.mkdirSync(path.dirname(paths.baseline), { recursive: true });
  if (writeBaseline.length) {
    fs.appendFileSync(paths.baseline, writeBaseline.map((b) => JSON.stringify(b)).join("\n") + "\n");
  }
  if (writeObservations.length) {
    fs.appendFileSync(paths.observations, writeObservations.map((o) => JSON.stringify(o)).join("\n") + "\n");
  }

  const verified = ensureVerifiedFile(paths.verifiedCsv);
  const merged = upsertVerifiedRows(verified.rows, dedupeEntries(verifiedEntries));
  if (merged.added || merged.updated || verified.migrated) {
    // Le fichier garde ses colonnes historiques ; les nouvelles sont ajoutées à droite.
    writeVerifiedFile(paths.verifiedCsv, verified.header, merged.rows);
  }

  const registryUpdated = updateRegistry(paths.registry, bestLinkByDomain);

  report.verifiedRows = merged.rows.length;
  report.verifiedAdded = merged.added;
  report.verifiedUpdated = merged.updated;
  report.registryUpdated = registryUpdated;
  report.finishedAt = isoNow();
  report.domains = summarizeDomains(writeObservations, report.indeterminateDomains);

  if (opts.json) {
    fs.mkdirSync(path.dirname(opts.json), { recursive: true });
    fs.writeFileSync(opts.json, `${JSON.stringify(report, null, 2)}\n`);
  }

  // Rapport lisible écrit à chaque exécution réelle (jamais en dry-run).
  const reportPath =
    opts.report === false
      ? null
      : opts.report ??
        path.join(
          path.dirname(paths.baseline),
          // Heure incluse : deux contrôles le même jour ne s'écrasent pas.
          `verification-${report.startedAt.slice(0, 10)}-${report.startedAt.slice(11, 16).replace(":", "")}Z.md`,
        );
  if (reportPath) {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, renderReportMarkdown(report));
    report.reportPath = reportPath;
    if (!opts.quiet) log(`Rapport lisible                   : ${reportPath}`);
  }

  return report;
}

/** Résumé par domaine, pour le rapport lisible. */
function summarizeDomains(records, indeterminateDomains) {
  const map = new Map();
  for (const record of records) {
    const item =
      map.get(record.domain) ?? { domain: record.domain, pages: 0, fetched: 0, unavailable: 0, withLink: 0 };
    item.pages += 1;
    if (record.kind === "present" || record.kind === "absent") item.fetched += 1;
    else item.unavailable += 1;
    if (record.linkPresent) item.withLink += 1;
    map.set(record.domain, item);
  }
  for (const item of map.values()) {
    item.indeterminate = indeterminateDomains.includes(item.domain);
    item.status = item.withLink
      ? "lien constaté"
      : item.fetched === 0
        ? item.unavailable
          ? "contrôle bloqué"
          : "non contrôlé"
        : item.indeterminate
          ? "indéterminé (contrôle impossible)"
          : "sans lien sur les URL contrôlées";
  }
  return [...map.values()].sort((a, b) => a.domain.localeCompare(b.domain));
}

/** Rapport markdown d'une exécution : même chiffres que la console, plus le détail. */
export function renderReportMarkdown(report) {
  const lines = [];
  lines.push(`# Vérification des backlinks — ${String(report.startedAt).slice(0, 10)}`);
  lines.push("");
  lines.push(`Exécution : ${report.startedAt} → ${report.finishedAt ?? "en cours"}`);
  lines.push("");
  lines.push("## Compteurs");
  lines.push("");
  lines.push("| Indicateur | Valeur |");
  lines.push("|---|---|");
  lines.push(`| Domaines dans le registre | ${report.registryDomains} |`);
  lines.push(`| Sites candidats contrôlés | ${report.candidates} |`);
  lines.push(`| Pages effectivement récupérées | ${report.pagesFetched} |`);
  lines.push(`| Pages avec lien Parrainio constaté | ${report.pagesWithLink} |`);
  lines.push(`| Nouveaux liens depuis le dernier contrôle | ${report.newLinks.length} |`);
  lines.push(`| Liens déjà connus et toujours présents | ${report.knownLinks.length} |`);
  lines.push(`| Liens disparus de pages accessibles | ${report.disappeared.length} |`);
  lines.push(`| Pages sans lien sur les URL contrôlées | ${report.noLinkPages} |`);
  lines.push(`| Pages bloquées ou inaccessibles | ${report.blockedOrUnreachable} |`);
  lines.push(`| Domaines au résultat indéterminé | ${new Set(report.indeterminateDomains).size} |`);
  lines.push(`| Lignes dans \`3-backlinks-verifies.csv\` | ${report.verifiedRows ?? 0} (${report.verifiedAdded ?? 0} ajout(s)) |`);
  lines.push("");
  lines.push("### Origine des liens");
  lines.push("");
  lines.push("| Catégorie | Nombre |");
  lines.push("|---|---|");
  lines.push(`| Liens préexistants | ${report.preexisting.length} |`);
  lines.push(`| Liens d'origine indéterminée | ${report.undetermined.length} |`);
  lines.push(`| Nouveaux liens constatés depuis le dernier contrôle | ${report.newLinks.length} |`);
  lines.push("");
  lines.push("> Un nouveau lien constaté n'est pas nécessairement un lien obtenu grâce à la campagne :");
  lines.push("> seule une publication postérieure au contact permet de l'affirmer.");
  lines.push("");

  const domains = report.domains ?? [];
  if (domains.length) {
    lines.push("## Détail par domaine");
    lines.push("");
    lines.push("| Domaine | Pages | Récupérées | Indisponibles | Lien | Statut |");
    lines.push("|---|---|---|---|---|---|");
    for (const d of domains) {
      lines.push(
        `| ${d.domain} | ${d.pages} | ${d.fetched} | ${d.unavailable} | ${d.withLink} | ${d.status} |`,
      );
    }
    lines.push("");
  }

  if (report.publicationResults?.length) {
    lines.push("## Pages de publication contrôlées");
    lines.push("");
    lines.push("| Domaine | Page | HTTP | Constat | Autres domaines liés |");
    lines.push("|---|---|---|---|---|");
    for (const p of report.publicationResults) {
      lines.push(
        `| ${p.domain} | ${p.url} | ${p.httpStatus ?? "—"} | ${p.status} | ${(p.externalHosts ?? []).join(", ") || "—"} |`,
      );
    }
    lines.push("");
    lines.push("> Une page annoncée n'est un backlink qu'une fois le lien HTML constaté.");
    lines.push("");
  }

  const section = (title, items) => {
    if (!items?.length) return;
    lines.push(`## ${title}`);
    lines.push("");
    for (const item of items) {
      lines.push(`- \`${item.domain}\` — ${item.pageUrl ?? ""} (HTTP ${item.httpStatus ?? "?"})`);
    }
    lines.push("");
  };
  section("Nouveaux liens", report.newLinks);
  section("Liens disparus", report.disappeared);

  const indeterminate = [...new Set(report.indeterminateDomains)];
  if (indeterminate.length) {
    lines.push("## Domaines indéterminés");
    lines.push("");
    lines.push("Pages non récupérées ou couverture insuffisante : aucune conclusion n'est tirée.");
    lines.push("");
    for (const d of indeterminate) lines.push(`- ${d}`);
    lines.push("");
  }

  if (report.errors?.length) {
    lines.push("## Erreurs techniques");
    lines.push("");
    for (const e of report.errors) lines.push(`- ${e}`);
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function dedupeEntries(entries) {
  const seen = new Set();
  return entries.filter((e) => {
    const key = `${normalizeDomain(e.domain)}|${normalizeUrl(e.pageUrl)}|${e.destination}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function printReport(report, log = console.log) {
  log("\n=== Vérification des backlinks — rapport ===");
  log(`Domaines dans le registre        : ${report.registryDomains}`);
  log(`Sites candidats contrôlés        : ${report.candidates}`);
  log(`Pages effectivement récupérées   : ${report.pagesFetched}`);
  log(`Pages avec lien vers Parrainio   : ${report.pagesWithLink}`);
  log(`Nouveaux liens constatés         : ${report.newLinks.length}`);
  log(`Liens déjà connus (toujours là)  : ${report.knownLinks.length}`);
  log(`Liens disparus (page accessible) : ${report.disappeared.length}`);
  log(`Pages sans lien (URL contrôlées) : ${report.noLinkPages}`);
  log(`Pages bloquées ou inaccessibles  : ${report.blockedOrUnreachable}`);
  if (report.publicationResults?.length) {
    log(`Pages de publication contrôlées : ${report.publicationResults.length}`);
  }
  log(`Domaines au résultat indéterminé : ${new Set(report.indeterminateDomains).size}`);
  log("");
  log(`Liens préexistants (baseline)    : ${report.preexisting.length}`);
  log(`Liens d'origine indéterminée     : ${report.undetermined.length}`);
  log(`Lignes dans 3-backlinks-verifies : ${report.verifiedRows} (${report.verifiedAdded} ajout(s))`);
  if (report.disappeared.length) {
    log("\nLiens disparus :");
    for (const d of report.disappeared) log(` - ${d.domain} — ${d.pageUrl}`);
  }
  log(
    "\nUn nouveau lien constaté n'est pas nécessairement un lien obtenu grâce à la campagne : " +
      "seule une publication postérieure au contact permet de l'affirmer.",
  );
}

/* ---------------------------------------------------------------------- CLI */

function parseArgs(argv) {
  const args = {
    dryRun: false,
    limit: 0,
    includeAll: false,
    maxPages: 8,
    concurrency: 4,
    timeout: 15_000,
    useResolve: true,
    useRobots: true,
    initBaseline: false,
    publicationOnly: false,
    quiet: false,
    json: null,
    report: undefined,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--limit") args.limit = Number(next());
    else if (a === "--all") args.includeAll = true;
    else if (a === "--max-pages") args.maxPages = Number(next());
    else if (a === "--concurrency") args.concurrency = Number(next());
    else if (a === "--timeout") args.timeout = Number(next());
    else if (a === "--no-resolve") args.useResolve = false;
    else if (a === "--no-robots") args.useRobots = false;
    else if (a === "--init-baseline") args.initBaseline = true;
    else if (a === "--publication-only") args.publicationOnly = true;
    else if (a === "--json") args.json = next();
    else if (a === "--report") args.report = next();
    else if (a === "--no-report") args.report = false;
    else if (a === "--quiet") args.quiet = true;
    else if (a === "--help" || a === "-h") {
      console.log(
        "node scripts/netlinking-check-backlinks.mjs [--dry-run] [--limit N] [--all] " +
          "[--max-pages N] [--concurrency N] [--no-resolve] [--no-robots] [--init-baseline] " +
          "[--json file] [--report file|--no-report] [--publication-only] [--quiet]",
      );
      process.exit(0);
    }
  }
  return args;
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  const args = parseArgs(process.argv);
  runCheck(args)
    .then((report) => {
      if (report.dryRun) return;
      printReport(report);
      process.exitCode = 0;
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
