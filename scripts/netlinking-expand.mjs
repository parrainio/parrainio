#!/usr/bin/env node
/**
 * netlinking-expand.mjs — découverte de domaines par exploration de liens.
 *
 * Usage :
 *   node scripts/netlinking-expand.mjs --input temp/hubs.txt --out temp/candidats-expand.txt
 *   node scripts/netlinking-expand.mjs --input temp/hubs.txt --depth 2
 *
 * Entrée : une URL de départ par ligne (page « meilleurs blogs », blogroll,
 * page de ressources, annuaire, article comparatif…).
 *
 * Le script récupère les pages, extrait les domaines sortants, conserve la page
 * d'origine comme preuve de découverte, puis (avec --depth 2) part des
 * nouveaux domaines pour un second passage sur leur page d'accueil.
 *
 * Aucun contournement de protection : un 403/429 est enregistré et ignoré.
 */

import fs from "node:fs";
import path from "node:path";

const UA = "Mozilla/5.0 (compatible; ParrainioBot/1.0; +https://parrainio.fr) netlinking-research";
const MAX_BYTES = 400_000;

const EXCLUDED = new Set([
  "wikipedia.org", "youtube.com", "facebook.com", "instagram.com", "twitter.com", "x.com",
  "linkedin.com", "tiktok.com", "pinterest.com", "reddit.com", "quora.com", "amazon.fr",
  "google.com", "google.fr", "apple.com", "microsoft.com", "pagesjaunes.fr", "societe.com",
  "indeed.fr", "leboncoin.fr", "cdiscount.com", "w3.org", "parrainio.fr", "archive.org",
  "issuu.com", "scribd.com", "slideshare.net", "wordpress.com", "blogspot.com", "medium.com",
  "substack.com", "gstatic.com", "googleapis.com", "cloudflare.com", "gravatar.com",
  "wordpress.org", "jquery.com", "schema.org", "creativecommons.org", "addtoany.com",
  "sharethis.com", "doubleclick.net", "googletagmanager.com", "hotjar.com", "facebook.net",
  "licdn.com", "bing.com", "duckduckgo.com", "mojeek.com", "yandex.com", "whatsapp.com",
  "telegram.org", "t.me", "bit.ly", "tinyurl.com", "feedburner.com", "paypal.com",
  "stripe.com", "shopify.com", "wix.com", "squarespace.com", "mailchimp.com",
  // hébergeurs, plateformes et raccourcisseurs rencontrés dans les blogrolls
  "wufoo.com", "typeform.com", "notion.com", "deezer.com", "anchor.fm", "amzn.to",
  "amzlink.to", "over-blog.com", "overblog.fr", "canalblog.com", "skyrock.com",
  "viadeo.com", "t.me", "linktr.ee", "calendly.com", "zoom.us", "teads.tv",
  "outbrain.com", "taboola.com", "criteo.com", "adservice.google.com", "serving-sys.com",
]);

/** Préfixes techniques à retirer pour retrouver le domaine de marque. */
const TECH_PREFIXES = new Set([
  "app", "apps", "admin", "aide", "abos", "abo", "account", "accounts", "academy",
  "alumni", "emploi", "emplois", "kiosque", "boutique", "secure", "my", "espace",
  "client", "clients", "extranet", "intranet", "login", "api", "cdn", "static",
  "assets", "mail", "webmail", "support", "help", "docs", "developer", "developers",
  "dev", "staging", "test", "preview", "blog", "www2", "m", "fr",
]);

function parseArgs(argv) {
  const args = { input: null, out: "temp/candidats-expand.txt", edges: "temp/edges.json", depth: 1, concurrency: 6, timeout: 10_000 };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === "--input") args.input = next();
    else if (a === "--out") args.out = next();
    else if (a === "--edges") args.edges = next();
    else if (a === "--depth") args.depth = Number(next());
    else if (a === "--concurrency") args.concurrency = Number(next());
    else if (a === "--timeout") args.timeout = Number(next());
  }
  if (!args.input) {
    console.error("--input requis (une URL par ligne)");
    process.exit(1);
  }
  return args;
}

function normalizeDomain(raw) {
  let value = String(raw ?? "").trim().toLowerCase();
  value = value.replace(/^[a-z]+:\/\//, "").split("/")[0].split("?")[0].replace(/:\d+$/, "");
  value = value.replace(/^www\./, "").replace(/\.$/, "");
  // blog.exemple.fr, app.exemple.fr → exemple.fr
  const parts = value.split(".");
  while (parts.length > 2 && TECH_PREFIXES.has(parts[0])) parts.shift();
  value = parts.join(".");
  return /^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(value) && value.length < 80 ? value : "";
}

function isExcluded(domain) {
  if (EXCLUDED.has(domain)) return true;
  for (const ex of EXCLUDED) if (domain.endsWith(`.${ex}`)) return true;
  return false;
}

async function fetchHtml(url, timeout) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(timeout),
      headers: { "user-agent": UA, accept: "text/html", "accept-language": "fr-FR,fr;q=0.9" },
    });
    const buf = await res.arrayBuffer();
    const html = new TextDecoder("utf-8").decode(buf.slice(0, MAX_BYTES));
    return { url, finalUrl: res.url || url, status: res.status, ok: res.ok, html };
  } catch (err) {
    return { url, finalUrl: url, status: 0, ok: false, html: "", error: String(err?.message ?? err) };
  }
}

function outboundDomains(html, baseUrl) {
  const found = new Map();
  for (const m of html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)) {
    let u;
    try {
      u = new URL(m[1], baseUrl);
    } catch {
      continue;
    }
    if (!/^https?:$/.test(u.protocol)) continue;
    const domain = normalizeDomain(u.hostname);
    if (!domain || isExcluded(domain)) continue;
    if (!found.has(domain)) found.set(domain, u.toString());
  }
  return [...found.entries()].map(([domain, url]) => ({ domain, url }));
}

async function pool(items, concurrency, fn) {
  let cursor = 0;
  const out = [];
  async function worker() {
    while (cursor < items.length) {
      const item = items[cursor++];
      out.push(await fn(item));
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker));
  return out;
}

async function main() {
  const args = parseArgs(process.argv);
  const seedUrls = fs
    .readFileSync(args.input, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => /^https?:\/\//.test(l));

  const discovered = new Map(); // domain -> {domain, sources:Set, urls:Set}
  const edges = [];
  const failures = [];

  const addDomain = (domain, sourceUrl, targetUrl) => {
    if (!discovered.has(domain)) discovered.set(domain, { domain, sources: new Set(), urls: new Set() });
    const entry = discovered.get(domain);
    entry.sources.add(sourceUrl);
    entry.urls.add(targetUrl);
  };

  let frontier = seedUrls;
  for (let depth = 0; depth < args.depth; depth += 1) {
    console.log(`Niveau ${depth + 1} : ${frontier.length} page(s) à explorer…`);
    const results = await pool(frontier, args.concurrency, (url) => fetchHtml(url, args.timeout));
    const nextFrontier = [];
    for (const page of results) {
      if (!page.ok) {
        failures.push({ url: page.url, status: page.status, error: page.error ?? null });
        continue;
      }
      const links = outboundDomains(page.html, page.finalUrl);
      for (const link of links) {
        addDomain(link.domain, page.finalUrl, link.url);
        edges.push({ from: page.finalUrl, to: link.domain });
        if (depth + 1 < args.depth) nextFrontier.push(`https://${link.domain}`);
      }
    }
    frontier = [...new Set(nextFrontier)];
    console.log(`  → ${discovered.size} domaines cumulés, ${failures.length} page(s) en échec`);
  }

  const list = [...discovered.values()]
    .map((d) => ({ domain: d.domain, sources: [...d.sources].slice(0, 3), url: [...d.urls][0] }))
    .sort((a, b) => a.domain.localeCompare(b.domain));

  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, `${list.map((c) => c.domain).join("\n")}\n`);
  fs.writeFileSync(args.edges, `${JSON.stringify({ seeds: seedUrls.length, candidates: list, edges, failures }, null, 2)}\n`);

  console.log(`\n${list.length} domaines candidats → ${args.out} (${edges.length} liens observés).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
