#!/usr/bin/env node
/**
 * netlinking-seeds.mjs — récolte de domaines candidats à partir de recherches web.
 *
 * Usage :
 *   node scripts/netlinking-seeds.mjs --out temp/candidats-seeds.txt --queries temp/queries.txt
 *   node scripts/netlinking-seeds.mjs                 # jeu de requêtes intégré
 *
 * Principe : chaque requête interroge un moteur qui renvoie du HTML statique
 * (deux pages de résultats maximum), puis les domaines sont normalisés,
 * dédupliqués et filtrés. La requête d'origine est conservée comme preuve de
 * découverte pour chaque domaine.
 *
 * Aucun contournement de protection : en cas de 202/429, la requête est
 * abandonnée et signalée. Les résultats ne sont que des candidats — le script
 * netlinking-discover.mjs doit ensuite vérifier les pages réelles.
 */

import fs from "node:fs";
import path from "node:path";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const QUERIES = [
  // Parrainage et primes
  "parrainage banque prime de bienvenue",
  "code parrain banque en ligne",
  "meilleures offres de parrainage 2026",
  "prime parrainage carte bancaire comparatif",
  "parrainage assurance prime",
  "parrainage courtier bourse prime",
  "parrainage crypto plateforme prime",
  "parrainage cashback site",
  "programme de parrainage comparatif",
  "codes de parrainage liste",
  // Finances personnelles
  "blog finances personnelles indépendant",
  "blog épargne investissement conseils",
  "comparatif banque en ligne 2026",
  "guide banque en ligne frais",
  "meilleure épargne livret comparatif",
  "assurance vie comparatif blog",
  "courtier en ligne comparatif frais",
  "budget familial blog conseils",
  "pouvoir d'achat conseils économies",
  "dossier primes bancaires journaliste",
  // Cashback, bons plans
  "site cashback comparatif",
  "bons plans économies blog",
  "réductions codes promo finance",
  "cashback banque différence parrainage",
  // Contribution éditoriale
  "proposer un article finance blog",
  "articles invités finance personnelle",
  "contribuer blog argent",
  "écrire pour nous finance",
  "tribune libre économie finances",
  "guest post personal finance France",
  // Annuaires et ressources
  "annuaire blogs finances personnelles",
  "annuaire sites économie finance France",
  "liste de blogs finance à suivre",
  "ressources utiles finances personnelles",
  "suggérer un site annuaire finance",
  "ajouter un lien annuaire économie",
  "annuaire blog argent gratuit",
  // Médias
  "média économie grand public France",
  "journaliste finances personnelles banque",
  "rubrique argent magazine en ligne",
  // Angles complémentaires
  "comparateur offres bancaires indépendant",
  "site comparatif assurances budget",
  "blog investissement débutant France",
  "blog immobilier financement primo-accédant",
  "blog retraite épargne France",
  "blog impôts optimisation fiscale",
  "site bons plans pouvoir d'achat",
  "blog consommation droit banque",
  "fintech blog épargne France",
  "comparatif néobanque frais",
  "blog argent couple budget",
  "site conseils gestion budget",
  "blog indépendance financière France",
  "blog dividendes bourse France",
  "forum épargne conseils banque",
  "comparateur frais bancaires association",
  "site information bancaire consommateur",
  "blog micro-entrepreneur finances",
];

const EXCLUDED = new Set([
  "wikipedia.org", "fr.wikipedia.org", "youtube.com", "facebook.com", "instagram.com",
  "twitter.com", "x.com", "linkedin.com", "tiktok.com", "pinterest.com", "reddit.com",
  "quora.com", "amazon.fr", "google.com", "google.fr", "apple.com", "microsoft.com",
  "pagesjaunes.fr", "societe.com", "indeed.fr", "leboncoin.fr", "cdiscount.com",
  "duckduckgo.com", "bing.com", "mojeek.com", "yandex.com", "w3.org",
  "parrainio.fr", "web.archive.org", "archive.org", "issuu.com", "scribd.com",
  "slideshare.net", "wordpress.com", "blogspot.com", "medium.com", "substack.com",
]);

function parseArgs(argv) {
  const args = { out: "temp/candidats-seeds.txt", json: "temp/seeds.json", queries: null, maxQueries: 0, pages: 2 };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === "--out") args.out = next();
    else if (a === "--json") args.json = next();
    else if (a === "--queries") args.queries = next();
    else if (a === "--max-queries") args.maxQueries = Number(next());
    else if (a === "--pages") args.pages = Number(next());
  }
  return args;
}

function normalizeDomain(raw) {
  let value = String(raw ?? "").trim().toLowerCase();
  value = value.replace(/^[a-z]+:\/\//, "").split("/")[0].split("?")[0].replace(/:\d+$/, "");
  value = value.replace(/^www\./, "").replace(/\.$/, "");
  return /^[a-z0-9.-]+\.[a-z]{2,}$/.test(value) ? value : "";
}

async function search(query, offset) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}&kl=fr-fr${offset ? `&s=${offset}` : ""}`;
  const res = await fetch(url, {
    headers: { "user-agent": UA, accept: "text/html", "accept-language": "fr-FR,fr;q=0.9" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) return { status: res.status, hosts: [] };
  const html = await res.text();
  const hosts = new Set();
  for (const m of html.matchAll(/uddg=([^&"]+)/g)) {
    try {
      const domain = normalizeDomain(new URL(decodeURIComponent(m[1])).hostname);
      if (domain) hosts.add(domain);
    } catch {
      /* résultat illisible, ignoré */
    }
  }
  return { status: res.status, hosts: [...hosts] };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const args = parseArgs(process.argv);
  let queries = QUERIES;
  if (args.queries) {
    queries = fs.readFileSync(args.queries, "utf8").split(/\r?\n/).map((q) => q.trim()).filter((q) => q && !q.startsWith("#"));
  }
  if (args.maxQueries > 0) queries = queries.slice(0, args.maxQueries);

  const found = new Map();
  const stats = { queries: 0, requests: 0, refused: 0, excluded: 0 };

  for (const query of queries) {
    let added = 0;
    for (let page = 0; page < args.pages; page += 1) {
      let result;
      try {
        result = await search(query, page * 10);
      } catch (err) {
        result = { status: 0, hosts: [], error: String(err?.message ?? err) };
      }
      stats.requests += 1;
      if (result.status === 202 || result.status === 429 || result.status === 0) {
        stats.refused += 1;
        break;
      }
      for (const host of result.hosts) {
        if (EXCLUDED.has(host)) {
          stats.excluded += 1;
          continue;
        }
        if (!found.has(host)) {
          found.set(host, { domain: host, queries: [query], pages: [page * 10], foundAt: new Date().toISOString().slice(0, 10) });
          added += 1;
        } else if (!found.get(host).queries.includes(query)) {
          found.get(host).queries.push(query);
        }
      }
      await sleep(1500 + Math.random() * 900);
    }
    stats.queries += 1;
    console.log(`[${stats.queries}/${queries.length}] ${query} → +${added} (total ${found.size})`);
  }

  const list = [...found.values()].sort((a, b) => a.domain.localeCompare(b.domain));
  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, `${list.map((c) => c.domain).join("\n")}\n`);
  fs.writeFileSync(args.json, `${JSON.stringify({ stats, candidates: list }, null, 2)}\n`);

  console.log(
    `\n${list.length} domaines candidats écrits dans ${args.out} ` +
      `(${stats.requests} requêtes HTTP, ${stats.refused} refus moteur, ${stats.excluded} domaines exclus).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
