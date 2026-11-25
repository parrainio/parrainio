#!/usr/bin/env node
/**
 * netlinking-find-contact.mjs — retrouver une adresse de contact publiée après
 * un échec de livraison.
 *
 * Règles :
 *   - aucune adresse n'est devinée : seules celles publiées sur le site comptent ;
 *   - aucune protection anti-robot n'est contournée (403 / CAPTCHA = arrêt) ;
 *   - aucun e-mail n'est envoyé, aucune file d'attente n'est modifiée ;
 *   - `--apply` se contente de proposer l'adresse dans `contacts-email.csv` et
 *     de l'inscrire dans le registre, avec sa provenance et sa date ;
 *   - un domaine en opposition est ignoré sans même être visité.
 *
 * Usage :
 *   node scripts/netlinking-find-contact.mjs --bounces
 *   node scripts/netlinking-find-contact.mjs --domain arawox.fr
 *   node scripts/netlinking-find-contact.mjs --bounces --apply
 *   node scripts/netlinking-find-contact.mjs --domain x.fr --dry-run
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  decodeHtmlEntities,
  defaultFetch,
  isoNow,
  normalizeDomain,
  normalizeUrl,
  readCsvObjects,
  readJsonl,
  writeCsv,
} from "./netlinking-check-backlinks.mjs";

export const DEFAULT_PATHS = {
  replies: "docs/netlinking/donnees/reponses-email.jsonl",
  contacts: "docs/netlinking/contacts-email.csv",
  registry: "docs/netlinking/base-prospection.csv",
  oppositions: "docs/netlinking/oppositions.csv",
  out: "docs/netlinking/donnees/contacts-alternatifs.jsonl",
};

const BLOCK_STATUSES = new Set([401, 403, 405, 406, 409, 429, 451, 503]);
const CHALLENGE_MARKERS = ["just a moment", "cf-chl", "captcha-delivery", "datadome", "attention required"];

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+/gi;
const MAILTO_RE = /mailto:([^"'<>\s?]+)/gi;
const JUNK_LOCAL =
  /^(noreply|no-reply|ne-pas-repondre|ne_pas_repondre|postmaster|mailer-daemon|abuse|privacy|dpo|rgpd|webmaster|sentry|wixpress|wordpress|abc|exemple|example|votre|votreadresse|monemail|email|test|nom|prenom)(?:[._+-]|@|$)/i;
const JUNK_HOSTS = new Set([
  "xyz.com",
  "example.com",
  "example.org",
  "example.fr",
  "exemple.fr",
  "exemple.com",
  "domain.com",
  "email.com",
  "mondomaine.fr",
  "votredomaine.fr",
  "test.com",
  "sentry.io",
  "wixpress.com",
  "godaddy.com",
  "cloudflare.com",
]);
const JUNK_HOST_SUFFIXES = [".sentry.io", ".wixpress.com", ".godaddy.com", ".cloudflare.com"];

/** Domaines de gabarit ou de service : jamais de vrais contacts. */
function isJunkHost(host) {
  const h = String(host ?? "").toLowerCase();
  return JUNK_HOSTS.has(h) || JUNK_HOST_SUFFIXES.some((suffix) => h.endsWith(suffix));
}
const JUNK_EXT = /\.(png|jpe?g|gif|webp|svg|css|js|woff2?|ttf|ico)$/i;
const CONTACT_PAGE_RE = /\/(contact|contacts|mentions[-_]?legales|mentions[-_]?l[ée]gales|legal|impressum|a[-_]?propos|about|equipe|[ée]quipe|redaction|r[ée]daction|qui[-_]sommes[-_]nous)(\/|$|\.)/i;
const GOOD_LOCAL = /^(contact|contacts|redac|redaction|r[ée]daction|editorial|[ée]ditorial|info|infos|bonjour|hello|team|presse|partenariat|partenariats|magazine)/i;

/** Une adresse de contact plausible, publiée sur une page. */
export function extractEmails(html, sourceUrl) {
  const text = decodeHtmlEntities(String(html ?? ""));
  const found = new Map();
  const add = (raw, kind) => {
    let address = String(raw ?? "").trim();
    try {
      address = decodeURIComponent(address);
    } catch {
      /* valeur non encodée */
    }
    address = address.replace(/^mailto:/i, "").replace(/[.,;:!?)\]]+$/, "").toLowerCase();
    if (!/^[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(address)) return;
    if (JUNK_LOCAL.test(address) || isJunkHost(address.split("@")[1] ?? "") || JUNK_EXT.test(address)) return;
    const previous = found.get(address);
    // Un `mailto:` explicite vaut mieux qu'une occurrence dans le texte.
    if (!previous || (previous.kind === "texte" && kind === "mailto")) found.set(address, { address, kind, sourceUrl });
  };
  for (const m of text.matchAll(MAILTO_RE)) add(m[1], "mailto");
  for (const m of text.matchAll(EMAIL_RE)) add(m[0], "texte");
  return [...found.values()];
}

/** Pages de contact / mentions légales liées depuis l'accueil. */
export function discoverContactPages(html, baseUrl) {
  const pages = [];
  for (const m of String(html ?? "").matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]{0,120}?)<\/a>/gi)) {
    const href = m[1];
    const label = decodeHtmlEntities(m[2].replace(/<[^>]+>/g, " "));
    if (!CONTACT_PAGE_RE.test(href) && !/contact|mentions|legal|à propos|a propos|qui sommes/i.test(label)) continue;
    try {
      const url = new URL(href, baseUrl);
      if (!/^https?:$/.test(url.protocol)) continue;
      if (normalizeDomain(url.hostname) !== normalizeDomain(new URL(baseUrl).hostname)) continue;
      pages.push(normalizeUrl(url.toString()));
    } catch {
      /* lien invalide */
    }
  }
  return [...new Set(pages)];
}

/**
 * Classe les adresses trouvées. Le domaine du site primes sur les boîtes
 * grand public, et une adresse déjà rejetée par le serveur est écartée.
 */
export function rankContactEmails(candidates, { domain, invalidEmails = [] } = {}) {
  const site = normalizeDomain(domain);
  const invalid = new Set(invalidEmails.map((e) => String(e).toLowerCase()));
  const ranked = [];
  for (const candidate of candidates) {
    const address = candidate.address.toLowerCase();
    if (invalid.has(address)) continue;
    const host = normalizeDomain(address.split("@")[1] ?? "");
    const local = address.split("@")[0] ?? "";
    let score = 0;
    if (host === site || host.endsWith(`.${site}`)) score += 5;
    if (candidate.kind === "mailto") score += 2;
    if (GOOD_LOCAL.test(local)) score += 2;
    if (candidate.sourceUrl && CONTACT_PAGE_RE.test(new URL(candidate.sourceUrl).pathname)) score += 1;
    if (host !== site && !host.endsWith(`.${site}`)) score -= 2;
    const sameDomain = host === site || host.endsWith(`.${site}`);
    ranked.push({
      address,
      score,
      kind: candidate.kind,
      sourceUrl: candidate.sourceUrl,
      confidence: sameDomain && candidate.kind === "mailto" ? "Confirmée" : sameDomain ? "Probable" : "À vérifier",
    });
  }
  ranked.sort((a, b) => b.score - a.score || a.address.localeCompare(b.address));
  return ranked;
}

function looksBlocked(status, text) {
  if (BLOCK_STATUSES.has(status)) return true;
  if (status === 200) {
    const head = String(text ?? "").slice(0, 4000).toLowerCase();
    return CHALLENGE_MARKERS.some((marker) => head.includes(marker));
  }
  return false;
}

/**
 * Cherche une adresse publiée pour un domaine. Aucune requête n'est faite en
 * dehors du site ; un blocage arrête le domaine au lieu d'être contourné.
 */
export async function findContactForDomain(domain, options = {}) {
  const fetchImpl = options.fetchImpl ?? defaultFetch;
  const timeout = options.timeout ?? 12_000;
  const maxPages = options.maxPages ?? 6;
  const site = normalizeDomain(domain);
  const origin = `https://${site}`;
  const pages = [`${origin}/`, `${origin}/contact`, `${origin}/contact/`, `${origin}/mentions-legales`];
  const seenPages = new Set();
  const candidates = [];
  const errors = [];
  const visited = [];

  const fetchPage = async (url) => {
    const key = normalizeUrl(url);
    if (!key || seenPages.has(key)) return null;
    seenPages.add(key);
    try {
      const res = await fetchImpl(url, { timeout });
      visited.push({ url, status: res.status });
      return res;
    } catch (error) {
      errors.push(`${url} : ${error?.message ?? error}`);
      return { status: 0, finalUrl: url, text: "", error: String(error?.message ?? error) };
    }
  };

  const results = [];
  for (const url of pages) {
    if (results.length >= maxPages) break;
    const res = await fetchPage(url);
    if (!res) continue;
    results.push(res);
    if (looksBlocked(res.status, res.text)) {
      return {
        domain: site,
        status: "bloque",
        httpStatus: res.status,
        visited,
        sourceUrl: url,
        address: "",
        alternatives: [],
        note: "protection anti-robot : aucun contournement tenté",
      };
    }
    if (url === `${origin}/` && res.status === 200 && res.text) {
      for (const page of discoverContactPages(res.text, res.finalUrl || url)) pages.push(page);
    }
  }

  for (const res of results) {
    if (!res.text || res.status >= 400) continue;
    candidates.push(...extractEmails(res.text, res.finalUrl || origin));
  }

  const ranked = rankContactEmails(candidates, { domain: site, invalidEmails: options.invalidEmails });
  if (!ranked.length) {
    const transient = results.length > 0 && results.every((r) => r.status === 0);
    const invalid = new Set((options.invalidEmails ?? []).map((e) => String(e).toLowerCase()));
    const onlyRejected = candidates.length > 0 && candidates.every((c) => invalid.has(c.address.toLowerCase()));
    return {
      domain: site,
      status: transient ? "erreur temporaire" : "introuvable",
      httpStatus: results[0]?.status ?? 0,
      visited,
      sourceUrl: "",
      address: "",
      alternatives: [],
      note: transient
        ? errors[0] ?? "site injoignable"
        : onlyRejected
          ? "seule l'adresse rejetée par le serveur est publiée : aucune alternative fiable"
          : errors[0] ?? "aucune adresse publiée sur les pages consultées",
    };
  }
  const best = ranked[0];
  return {
    domain: site,
    status: "trouvee",
    httpStatus: 200,
    visited,
    sourceUrl: best.sourceUrl,
    address: best.address,
    confidence: best.confidence,
    kind: best.kind,
    alternatives: ranked.slice(0, 5),
    note: "",
  };
}

/** Domaines dont la dernière réponse connue est un échec de livraison. */
export function loadBounceTargets(paths, { log = () => {} } = {}) {
  const replies = readJsonl(paths.replies);
  const bounces = replies.filter((r) => r.category === "echec_livraison" && r.domain);
  const invalidByDomain = new Map();
  for (const row of bounces) {
    const domain = normalizeDomain(row.domain);
    const list = invalidByDomain.get(domain) ?? [];
    for (const address of row.failedRecipients ?? []) {
      const clean = String(address).toLowerCase();
      if (/@/.test(clean) && !list.includes(clean)) list.push(clean);
    }
    invalidByDomain.set(domain, list);
  }
  const registry = readCsvObjects(paths.registry).rows;
  const targets = [];
  for (const [domain, invalid] of invalidByDomain) {
    const row = registry.find((r) => normalizeDomain(r.domaine) === domain);
    // Une adresse `contact@` citée dans le registre est aussi invalide.
    if (row?.contact) {
      for (const address of String(row.contact).split(/[\s,;]+/)) {
        if (/@/.test(address) && !invalid.includes(address.toLowerCase())) invalid.push(address.toLowerCase());
      }
    }
    targets.push({ domain, invalidEmails: invalid, name: row?.nom ?? "" });
    log(`bounce connu : ${domain} (adresse rejetée : ${invalid.join(", ") || "non précisée"})`);
  }
  return targets;
}

/**
 * Normalise l'horodatage reçu : une date, une fonction ou une chaîne ISO doivent
 * tous produire `AAAA-MM-JJ`. Sans ce garde-fou, passer la fonction elle-même
 * écrivait littéralement « () => new » dans `date_verification`.
 */
function toIsoDate(value) {
  const raw = typeof value === "function" ? value() : value;
  const date = raw instanceof Date ? raw : new Date(String(raw));
  if (Number.isNaN(date.getTime())) return String(isoNow()).slice(0, 10);
  return date.toISOString().slice(0, 10);
}

/** Écrit la proposition : contacts-email.csv + registre, jamais d'envoi. */
export function applyProposal(paths, proposal, { now = isoNow() } = {}) {
  const result = { contactAdded: false, registryUpdated: false, reason: "" };
  if (proposal.status !== "trouvee" || !proposal.address) {
    result.reason = "aucune adresse fiable : rien à écrire";
    return result;
  }
  const date = toIsoDate(now);
  const contacts = readCsvObjects(paths.contacts);
  const duplicate = contacts.rows.find(
    (r) => normalizeDomain(r.domaine) === proposal.domain && String(r.email).toLowerCase() === proposal.address,
  );
  if (!duplicate) {
    const header = contacts.header.length
      ? contacts.header
      : [
          "domaine",
          "nom",
          "email",
          "source_url",
          "date_verification",
          "type_contact",
          "confiance",
          "thematique",
          "score",
          "modele",
          "objet",
          "texte_pret_a_envoyer",
          "statut",
          "raison_non_envoi",
        ];
    const row = {
      domaine: proposal.domain,
      nom: proposal.name ?? "",
      email: proposal.address,
      source_url: `${proposal.sourceUrl} (adresse ${proposal.kind === "mailto" ? "en mailto" : "dans le texte"} de la page)`,
      date_verification: date,
      type_contact: "rédaction",
      confiance: proposal.confidence ?? "À vérifier",
      thematique: "",
      score: "",
      modele: "",
      objet: "",
      texte_pret_a_envoyer: "",
      statut: "Adresse alternative trouvée, envoi à décider manuellement",
      raison_non_envoi: "Aucun envoi automatique : l'adresse remplace une adresse rejetée",
    };
    contacts.rows.push(row);
    writeCsv(paths.contacts, header, contacts.rows.map((r) => header.map((h) => r[h] ?? "")));
    result.contactAdded = true;
  } else {
    result.reason = "adresse déjà présente pour ce domaine";
  }

  const registry = readCsvObjects(paths.registry);
  const line = registry.rows.find((r) => normalizeDomain(r.domaine) === proposal.domain);
  if (line) {
    line.contact = proposal.address;
    line.prochaine_action = `Adresse alternative publiée trouvée le ${date} (${proposal.sourceUrl}) — envoi à décider manuellement`;
    line.derniere_verif = date;
    writeCsv(paths.registry, registry.header, registry.rows.map((r) => registry.header.map((h) => r[h] ?? "")));
    result.registryUpdated = true;
  }
  return result;
}

/** Boucle d'exécution, sans envoi ni écriture si `dryRun`. */
export async function runFindContacts(options = {}) {
  const paths = { ...DEFAULT_PATHS, ...(options.paths ?? {}) };
  const log = options.log ?? ((...args) => console.log(...args));
  const now = options.now ?? (() => new Date().toISOString());
  const oppositions = new Set(readCsvObjects(paths.oppositions).rows.map((r) => normalizeDomain(r.domaine)));
  let targets = options.domains?.length
    ? options.domains.map((d) => ({ domain: normalizeDomain(d), invalidEmails: [], name: "" }))
    : loadBounceTargets(paths, { log });
  if (Number.isInteger(options.limit) && options.limit > 0) targets = targets.slice(0, options.limit);

  const proposals = [];
  for (const target of targets) {
    if (!target.domain) continue;
    if (oppositions.has(target.domain)) {
      proposals.push({ domain: target.domain, status: "ignore — opposition", alternatives: [], address: "" });
      log(`  opposition ${target.domain} : ignoré`);
      continue;
    }
    const proposal = await findContactForDomain(target.domain, {
      fetchImpl: options.fetchImpl,
      timeout: options.timeout,
      maxPages: options.maxPages,
      invalidEmails: target.invalidEmails,
    });
    proposal.foundAt = now();
    proposal.name = target.name ?? "";
    proposal.invalidEmails = target.invalidEmails ?? [];
    proposals.push(proposal);
    const label =
      proposal.status === "trouvee"
        ? `${proposal.address} (${proposal.confidence}, ${proposal.sourceUrl})`
        : proposal.status;
    log(`  ${proposal.status === "trouvee" ? "✓" : "·"} ${proposal.domain} : ${label}`);
  }

  if (!options.dryRun && proposals.length) {
    fs.mkdirSync(path.dirname(paths.out), { recursive: true });
    fs.appendFileSync(paths.out, proposals.map((p) => JSON.stringify(p)).join("\n") + "\n");
  }
  const applied = [];
  if (options.apply && !options.dryRun) {
    const stamp = now();
    for (const proposal of proposals) {
      const result = applyProposal(paths, proposal, { now: stamp });
      applied.push({ domain: proposal.domain, ...result });
      if (result.contactAdded) log(`  → ${proposal.domain} : ${proposal.address} ajoutée à contacts-email.csv`);
    }
  }
  const summary = {
    examined: targets.length,
    found: proposals.filter((p) => p.status === "trouvee").length,
    notFound: proposals.filter((p) => p.status === "introuvable").length,
    blocked: proposals.filter((p) => p.status === "bloque").length,
    transient: proposals.filter((p) => p.status === "erreur temporaire").length,
    skipped: proposals.filter((p) => String(p.status).startsWith("ignore")).length,
    applied: applied.filter((a) => a.contactAdded).length,
    proposals,
    dryRun: Boolean(options.dryRun),
  };
  return summary;
}

/* -------------------------------------------------------------------- CLI */

function parseArgs(argv) {
  const args = { bounces: false, apply: false, dryRun: false, domains: [], limit: null, json: false };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === "--bounces") args.bounces = true;
    else if (a === "--apply") args.apply = true;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--json") args.json = true;
    else if (a === "--limit") args.limit = Number(next());
    else if (a === "--domain") args.domains.push(...String(next() ?? "").split(",").filter(Boolean));
    else if (a === "--help" || a === "-h") args.help = true;
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || (!args.bounces && !args.domains.length)) {
    console.log(
      "node scripts/netlinking-find-contact.mjs (--bounces | --domain exemple.fr) [--limit N] [--apply] [--dry-run] [--json]",
    );
    if (args.help) return;
    console.log("Aucune cible : précisez --bounces (échecs de livraison connus) ou --domain.");
    return;
  }
  const summary = await runFindContacts({
    domains: args.domains,
    limit: args.limit,
    apply: args.apply,
    dryRun: args.dryRun,
  });
  console.log("");
  console.log(`Domaines examinés        : ${summary.examined}`);
  console.log(`Adresses publiées trouvées : ${summary.found}`);
  console.log(`Sans adresse             : ${summary.notFound}`);
  console.log(`Bloqués (non contournés) : ${summary.blocked}`);
  console.log(`Erreurs temporaires      : ${summary.transient}`);
  console.log(`Ignorés (opposition)     : ${summary.skipped}`);
  if (args.apply) console.log(`Contacts ajoutés         : ${summary.applied}`);
  if (args.dryRun) console.log("[dry-run] aucun fichier écrit.");
  if (args.json) console.log(JSON.stringify(summary, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(`✗ ${error?.message ?? error}`);
    process.exitCode = 1;
  });
}
