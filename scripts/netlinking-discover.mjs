#!/usr/bin/env node
/**
 * netlinking-discover.mjs — préanalyse par lots des candidats netlinking.
 *
 * Usage :
 *   node scripts/netlinking-discover.mjs --input temp/candidats.txt --out temp/preanalyse.json
 *   node scripts/netlinking-discover.mjs --input temp/candidats.txt --out temp/preanalyse.json \
 *     --concurrency 6 --per-domain 4 --merge
 *
 * Entrée : un domaine par ligne (domaine, URL ou e-mail — l'e-mail est ignoré).
 * Sortie : JSON détaillé + rapport lisible sur stdout.
 *
 * Le script ne contourne aucune protection : un 403/429/CAPTCHA est enregistré
 * comme tel et le candidat part en file d'actions manuelles.
 */

import fs from "node:fs";
import path from "node:path";

const USER_AGENT =
  "Mozilla/5.0 (compatible; ParrainioBot/1.0; +https://parrainio.fr) netlinking-research";
const REGISTRY = "docs/netlinking/base-prospection.csv";
const MAX_BYTES = 600_000;

/* ------------------------------------------------------------------ options */

function parseArgs(argv) {
  const args = {
    input: null,
    out: "temp/preanalyse.json",
    concurrency: 6,
    perDomain: 4,
    timeout: 12_000,
    limit: 0,
    merge: false,
    skipKnown: true,
    mergeFrom: null,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === "--input") args.input = next();
    else if (a === "--out") args.out = next();
    else if (a === "--concurrency") args.concurrency = Number(next());
    else if (a === "--per-domain") args.perDomain = Number(next());
    else if (a === "--timeout") args.timeout = Number(next());
    else if (a === "--limit") args.limit = Number(next());
    else if (a === "--merge") args.merge = true;
    else if (a === "--merge-from") args.mergeFrom = next();
    else if (a === "--include-known") args.skipKnown = false;
    else if (a === "--help" || a === "-h") {
      console.log(          "node scripts/netlinking-discover.mjs --input <fichier> [--out <json>] " +
          "[--concurrency 6] [--per-domain 4] [--limit N] [--merge] [--include-known]\n" +
          "node scripts/netlinking-discover.mjs --merge-from <preanalyse.json> [--include-known]",
      );
      process.exit(0);
    }
  }
  if (!args.input && !args.mergeFrom) {
    console.error("--input requis (un domaine par ligne) ou --merge-from <json>");
    process.exit(1);
  }
  return args;
}

/* -------------------------------------------------------- normalisation */

/** www.exemple.fr/, https://Exemple.fr/x, contact@exemple.fr → exemple.fr */
export function normalizeDomain(raw) {
  let value = String(raw ?? "").trim().toLowerCase();
  if (!value || value.startsWith("#")) return "";
  if (value.includes("@") && !value.includes("://")) value = value.split("@").pop();
  value = value.replace(/^[a-z]+:\/\//, "");
  value = value.split("/")[0];
  value = value.split("?")[0];
  value = value.replace(/:\d+$/, "");
  value = value.replace(/^www\./, "");
  value = value.replace(/\.$/, "");
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(value)) return "";
  return value;
}

function brandKey(domain) {
  const base = domain.split(".").slice(0, -1).join(".");
  return base.replace(/[^a-z0-9]/g, "");
}

/* ------------------------------------------------------------- utilitaires */

const CONTACT_WORDS = [
  "contact", "mentions-legales", "mentions_legales", "mentionslegales", "a-propos",
  "about", "qui-sommes-nous", "legal", "impressum", "redaction", "equipe",
];
const CONTRIB_WORDS = [
  "proposer-un-article", "proposer-article", "proposer", "contribuer", "contribution",
  "suggerer", "suggérer", "ajouter-une-ressource", "ajouter", "ressources", "annuaire",
  "referencement", "référencer", "referencer", "publier", "partenariat", "partenaire",
  "ecrire-pour-nous", "write-for-us", "guest-post", "tribune", "soumettre", "submit",
];
const THEME_STRONG = [
  "parrainage", "parrain", "prime de bienvenue", "prime", "cashback", "banque en ligne",
  "néobanque", "neobanque", "épargne", "epargne", "livret", "assurance vie", "courtier",
  "bourse", "investissement", "budget", "finances personnelles", "pouvoir d'achat",
  "bons plans", "économies", "economies", "crédit", "credit immobilier", "impôts",
];
const PAID_SIGNALS = [
  "article sponsorisé", "articles sponsorisés", "lien payant", "liens payants",
  "publication payante", "publier un article payant", "tarifs", "nos prestations",
  "à partir de", "partir de 50", "partir de 100", "devis", "prestation payante",
  "guest post payant", "sponsored post",
];
const CAPTCHA_SIGNALS = [
  "g-recaptcha", "hcaptcha", "h-captcha", "cf-turnstile", "captcha_image",
  "recaptcha/api", "captcha",
];

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function deobfuscate(text) {
  return text
    .replace(/\s*[[({]\s*(?:arobase|at|chez)\s*[\])}]\s*/gi, "@")
    .replace(/\s+(?:arobase)\s+/gi, "@")
    .replace(/\s*[[({]\s*point\s*[\])}]\s*/gi, ".")
    .replace(/\s+(?:dot)\s+/gi, ".");
}

function title(html) {
  const m = html.match(/<title[^>]*>([\s\S]{0,300}?)<\/title>/i);
  return m ? stripHtml(m[1]).slice(0, 160) : "";
}

function extractAnchors(html, baseUrl) {
  const out = [];
  const re = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]{0,200}?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) && out.length < 400) {
    const href = m[1].trim();
    const label = stripHtml(m[2]).slice(0, 80);
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) continue;
    let url;
    try {
      url = new URL(href, baseUrl);
    } catch {
      continue;
    }
    if (!/^https?:$/.test(url.protocol)) continue;
    out.push({ url: url.toString(), label, href });
  }
  return out;
}

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;

function extractEmails(html) {
  const found = new Map();
  const add = (value, kind) => {
    const email = value.trim().toLowerCase().replace(/[.,;:)]+$/, "");
    if (!email || email.length > 120) return;
    if (/\.(png|jpe?g|gif|webp|svg|css|js)$/.test(email)) return;
    // Adresses de gabarit fréquentes dans les thèmes WordPress / formulaires :
    // elles ne désignent personne et ne doivent jamais devenir un contact.
    if (/^(exemple|example|email|e-mail|votre|your|nom|name|prenom|prénom|user|utilisateur|test|john\.bogle|jeanne|contact\.exemple)@/i.test(email)) return;
    const domainPart = email.split("@")[1] ?? "";
    if (/(sentry|wixpress|wordpress|example|domain)\./.test(domainPart)) return;
    if (/\b(exemple|example)\.(com|fr|org|net)$/.test(domainPart)) return;
    if (!found.has(email)) found.set(email, kind);
  };

  const mailto = /href\s*=\s*["']mailto:([^"'?&]+)/gi;
  let m;
  while ((m = mailto.exec(html))) {
    try {
      add(decodeURIComponent(m[1]).replace(/^mailto:/i, ""), "mailto");
    } catch {
      add(m[1], "mailto");
    }
  }

  const text = deobfuscate(stripHtml(html));
  const re = new RegExp(EMAIL_RE.source, "gi");
  while ((m = re.exec(text))) add(m[0], "texte");
  return [...found.entries()].map(([email, kind]) => ({ email, kind }));
}

/* ------------------------------------------------------------------- fetch */

async function fetchPage(url, timeout) {
  const started = Date.now();
  const attempt = async () => {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(timeout),
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml",
        "accept-language": "fr-FR,fr;q=0.9,en;q=0.5",
      },
    });
    const buf = await res.arrayBuffer();
    const html = new TextDecoder("utf-8").decode(buf.slice(0, MAX_BYTES));
    return { res, html };
  };

  try {
    let { res, html } = await attempt();
    if ((res.status === 429 || res.status === 503) && Date.now() - started < timeout) {
      await new Promise((r) => setTimeout(r, 2500));
      ({ res, html } = await attempt());
    }
    return {
      url,
      finalUrl: res.url || url,
      status: res.status,
      ok: res.ok,
      ms: Date.now() - started,
      html,
      error: null,
    };
  } catch (err) {
    const message = err?.name === "TimeoutError" ? "timeout" : String(err?.message ?? err);
    return { url, finalUrl: url, status: 0, ok: false, ms: Date.now() - started, html: "", error: message };
  }
}

/* --------------------------------------------------------------- analyse */

function pickUsefulPages(home, html) {
  const anchors = extractAnchors(html, home);
  const scored = new Map();
  for (const a of anchors) {
    let u;
    try {
      u = new URL(a.url);
    } catch {
      continue;
    }
    if (!/^https?:$/.test(u.protocol)) continue;
    const sameSite = u.hostname.replace(/^www\./, "") === new URL(home).hostname.replace(/^www\./, "");
    if (!sameSite) continue;
    const haystack = `${u.pathname} ${a.label}`.toLowerCase();
    let score = 0;
    if (CONTACT_WORDS.some((w) => haystack.includes(w))) score += 3;
    if (CONTRIB_WORDS.some((w) => haystack.includes(w))) score += 4;
    if (u.pathname === "/" || u.pathname === "") score -= 5;
    if (score <= 0) continue;
    const key = u.origin + u.pathname.replace(/\/$/, "");
    if (!scored.has(key) || scored.get(key).score < score) {
      scored.set(key, { url: key, score, label: a.label });
    }
  }
  return [...scored.values()].sort((a, b) => b.score - a.score);
}

function guessContactUrls(home) {
  const base = home.replace(/\/$/, "");
  return [
    `${base}/contact`,
    `${base}/contact/`,
    `${base}/mentions-legales`,
    `${base}/mentions-legales/`,
    `${base}/a-propos`,
    `${base}/a-propos/`,
  ];
}

function detectSignals(pages) {
  const combinedHtml = pages.map((p) => p.html).join("\n").toLowerCase();
  const combinedText = pages.map((p) => stripHtml(p.html)).join(" ").toLowerCase();

  const hasForm = /<form[\s>]/i.test(combinedHtml);
  const captcha = CAPTCHA_SIGNALS.filter((s) => combinedHtml.includes(s));
  const paid = PAID_SIGNALS.filter((s) => combinedText.includes(s));
  const contrib = CONTRIB_WORDS.filter((w) => combinedText.includes(w));
  const themeHits = THEME_STRONG.filter((w) => combinedText.includes(w));

  const emailVariants = [];
  const seen = new Set();
  for (const page of pages) {
    for (const { email, kind } of extractEmails(page.html)) {
      const key = `${email}|${page.url}`;
      if (seen.has(key)) continue;
      seen.add(key);
      emailVariants.push({ email, kind, sourceUrl: page.url });
    }
  }

  return { hasForm, captcha, paid, contrib, themeHits, emails: emailVariants };
}

function scoreCandidate(signals, homeStatus) {
  let score = 0;
  score += Math.min(8, signals.themeHits.length * 2);

  const hasEditorialPage = signals.contrib.some((w) =>
    ["proposer", "contribuer", "suggérer", "suggerer", "référencer", "referencer", "annuaire", "tribune", "soumettre", "submit"].includes(w),
  );
  if (hasEditorialPage) score += 5;
  else if (signals.contrib.length) score += 2;

  if (signals.emails.length) score += 3;
  else if (signals.hasForm) score += 1;

  if (homeStatus >= 200 && homeStatus < 300) score += 2;
  if (signals.paid.length) score -= 2;
  if (signals.captcha.length) score -= 1;

  return Math.max(0, Math.min(20, score));
}

async function analyzeCandidate(domain, opts) {
  const home = `https://${domain}`;
  const homePage = await fetchPage(home, opts.timeout);
  const pages = [homePage];
  const visited = new Set([homePage.finalUrl]);

  if (homePage.ok && homePage.html) {
    const candidates = pickUsefulPages(home, homePage.html);
    const guessed = guessContactUrls(home);
    const queue = [...candidates.map((c) => c.url), ...guessed];
    for (const url of queue) {
      if (pages.length > opts.perDomain) break;
      const key = url.replace(/\/$/, "");
      if (visited.has(key)) continue;
      visited.add(key);
      const page = await fetchPage(url, opts.timeout);
      if (page.ok && page.html) pages.push(page);
      if (page.status === 429) break;
    }
  }

  const signals = detectSignals(pages);
  const score = homePage.ok ? scoreCandidate(signals, homePage.status) : 0;

  const status = homePage.ok
    ? "preanalyse-ok"
    : homePage.status === 403 || homePage.status === 429
      ? "bloque"
      : "inaccessible";

  return {
    domain,
    brandKey: brandKey(domain),
    status,
    httpStatus: homePage.status,
    error: homePage.error,
    title: title(homePage.html),
    finalUrl: homePage.finalUrl,
    pagesChecked: pages.filter((p) => p.ok).map((p) => p.finalUrl),
    pagesAttempted: pages.length,
    hasForm: signals.hasForm,
    captcha: signals.captcha,
    paidSignals: signals.paid.slice(0, 6),
    contribSignals: signals.contrib.slice(0, 12),
    themeHits: signals.themeHits,
    emails: signals.emails.slice(0, 8),
    score,
    checkedAt: new Date().toISOString().slice(0, 10),
  };
}

/* -------------------------------------------------------------- registre */

function readRegistryDomains() {
  if (!fs.existsSync(REGISTRY)) return new Set();
  const content = fs.readFileSync(REGISTRY, "utf8");
  const domains = new Set();
  for (const line of content.split(/\r?\n/).slice(1)) {
    const first = line.split(";")[0]?.replace(/^"|"$/g, "").trim();
    const normalized = normalizeDomain(first);
    if (normalized) domains.add(normalized);
  }
  return domains;
}

const HEADER = [
  "domaine", "nom", "url", "page", "contact", "source", "type_opportunite", "score",
  "modele", "decouvert_le", "contacte_le", "statut", "confirmation", "reponse",
  "backlink_url", "motif", "derniere_verif", "prochaine_action",
];

function csvCell(value) {
  const s = String(value ?? "").replace(/\r?\n/g, " ");
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function mergeIntoRegistry(results, opts) {
  const known = readRegistryDomains();
  const rows = [];
  for (const r of results) {
    if (opts.skipKnown && known.has(r.domain)) continue;
    if (rows.some((x) => x.domain === r.domain)) continue;
    const email = r.emails.find((e) => e.kind === "mailto") ?? r.emails[0];
    // « Préanalysé » reste distinct d'« analysé » : aucun statut ambigu.
    const statut =
      r.status === "preanalyse-ok"
        ? "Découvert, non analysé"
        : r.status === "bloque"
          ? "Non contacté, avec raison"
          : "Exclu, avec raison";
    const prefix = r.status === "preanalyse-ok" ? `Préanalyse automatique (${r.pagesChecked.length} page(s) récupérée(s))` : "";
    const motif =
      r.status === "preanalyse-ok"
        ? [
            prefix,
            r.paidSignals.length ? `signaux payants : ${r.paidSignals.join(", ")}` : "",
            r.captcha.length ? `CAPTCHA : ${r.captcha.join(", ")}` : "",
            r.themeHits.length ? `thèmes : ${r.themeHits.slice(0, 5).join(", ")}` : "",
          ]
            .filter(Boolean)
            .join(" — ")
        : r.status === "bloque"
          ? `Accès refusé (HTTP ${r.httpStatus}) : action manuelle ou abandon`
          : `Site inaccessible (${r.error || `HTTP ${r.httpStatus}`})`;
    rows.push([
      r.domain, r.title || r.domain, `https://${r.domain}`, r.pagesChecked[0] || `https://${r.domain}`,
      email?.email ?? (r.hasForm ? "Formulaire détecté" : ""), email?.sourceUrl ?? "",
      r.contribSignals.length ? `Signaux éditoriaux : ${r.contribSignals.join(", ")}` : "",
      r.score, "", r.checkedAt, "", statut, "", "", "", motif, r.checkedAt, "",
    ]);
  }
  if (!rows.length) return 0;
  const needsHeader = !fs.existsSync(REGISTRY) || fs.statSync(REGISTRY).size === 0;
  const body = rows.map((r) => r.map(csvCell).join(";")).join("\n");
  fs.appendFileSync(REGISTRY, `${needsHeader ? HEADER.map(csvCell).join(";") + "\n" : ""}${body}\n`);
  return rows.length;
}

/* ------------------------------------------------------------------- main */

async function main() {
  const opts = parseArgs(process.argv);

  // Fusion d'une préanalyse existante dans le registre, sans nouveau crawl.
  if (opts.mergeFrom) {
    const existing = JSON.parse(fs.readFileSync(opts.mergeFrom, "utf8"));
    const added = mergeIntoRegistry(existing, opts);
    console.log(`Registre : ${added} ligne(s) ajoutée(s) depuis ${opts.mergeFrom}.`);
    return;
  }

  const raw = fs.readFileSync(opts.input, "utf8").split(/\r?\n/);
  const unique = new Map();
  const rejected = [];
  for (const line of raw) {
    const d = normalizeDomain(line);
    if (!d) {
      if (line.trim() && !line.trim().startsWith("#")) rejected.push(line.trim());
      continue;
    }
    if (!unique.has(d)) unique.set(d, true);
  }
  let domains = [...unique.keys()];
  const known = readRegistryDomains();
  const already = domains.filter((d) => known.has(d));
  if (opts.skipKnown) domains = domains.filter((d) => !known.has(d));
  if (opts.limit > 0) domains = domains.slice(0, opts.limit);

  console.log(
    `Entrée : ${raw.filter((l) => l.trim()).length} lignes → ${unique.size} domaines uniques, ` +
      `${already.length} déjà au registre, ${domains.length} à analyser.`,
  );
  if (rejected.length) console.log(`Ignorées (non interprétables) : ${rejected.slice(0, 10).join(", ")}`);

  const results = [];
  let cursor = 0;
  let done = 0;
  const started = Date.now();

  async function worker() {
    while (cursor < domains.length) {
      const domain = domains[cursor++];
      const result = await analyzeCandidate(domain, opts);
      results.push(result);
      done += 1;
      if (done % 25 === 0) {
        const rate = done / ((Date.now() - started) / 1000);
        console.log(`… ${done}/${domains.length} (${rate.toFixed(1)} domaines/s)`);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, opts.concurrency) }, worker));
  results.sort((a, b) => b.score - a.score || a.domain.localeCompare(b.domain));

  fs.mkdirSync(path.dirname(opts.out), { recursive: true });
  fs.writeFileSync(opts.out, `${JSON.stringify(results, null, 2)}\n`);

  const withEmail = results.filter((r) => r.emails.length).length;
  const withForm = results.filter((r) => r.hasForm).length;
  const blocked = results.filter((r) => r.status === "bloque").length;
  const unreachable = results.filter((r) => r.status === "inaccessible").length;
  const paid = results.filter((r) => r.paidSignals.length).length;

  console.log(`\nTerminé en ${((Date.now() - started) / 1000).toFixed(0)} s → ${opts.out}`);
  console.log(
    `Pages récupérées : ${results.filter((r) => r.status === "preanalyse-ok").length}/${results.length} sites ; ` +
      `e-mails publics : ${withEmail} ; formulaires : ${withForm} ; ` +
      `bloqués : ${blocked} ; inaccessibles : ${unreachable} ; signaux payants : ${paid}`,
  );

  if (opts.merge) {
    const added = mergeIntoRegistry(results, opts);
    console.log(`Registre : ${added} ligne(s) ajoutée(s) à ${REGISTRY}.`);
  }
}

const isDirectRun = process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]));
if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
