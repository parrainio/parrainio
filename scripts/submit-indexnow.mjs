/**
 * Soumission ponctuelle des URL existantes à IndexNow.
 *
 * Usage :
 *   npm run indexnow                          → soumet toutes les URL listées
 *   dans le sitemap de production en ligne (https://www.parrainio.fr/sitemap.xml) ;
 *   node scripts/submit-indexnow.mjs /offres/x /offres/y → soumet juste
 *   certaines URLs (chemins relatifs acceptés, normalisés sur le domaine
 *   canonique).
 *
 * Pourquoi le sitemap LIVE : c'est l'unique source d'URLs canoniquement
 * publiées (généré par le même code que l'application) — jamais une URL
 * morte, jamais une page noindex (mes-favoris, favoris, admin, api).
 * IndexNow déduplique de son côté et accepte jusqu'à ~10 000 URLs en un
 * seul POST : le catalogue entier part donc en un premier appel.
 *
 * Clé : publique par définition (elle sert uniquement à prouver la
 * propriété du site via {clé}.txt hébergé). Aucun secret lié au site
 * n'est manipulé ici.
 */

const SITE_URL = "https://www.parrainio.fr";
const KEY = "c886019b654d4c2db0b021fefd1d66ab";
const ENDPOINT = "https://api.indexnow.org/indexnow";

/** Pages hors index — même liste que lib/indexNow.ts. */
const NON_INDEXABLE_EXACT = new Set(["/mes-favoris", "/favoris"]);
const NON_INDEXABLE_PREFIXES = ["/admin", "/api"];

function filterIndexable(rawUrls) {
  const seen = new Set();
  const kept = [];
  for (const raw of rawUrls) {
    if (!raw) continue;
    const url = raw.startsWith("/") && !raw.startsWith("//") ? `${SITE_URL}${raw}` : raw;
    if (!url.startsWith(`${SITE_URL}/`) && url !== SITE_URL) continue;
    const path = url.slice(SITE_URL.length);
    if (NON_INDEXABLE_EXACT.has(path)) continue;
    if (NON_INDEXABLE_PREFIXES.some((prefix) => path.startsWith(prefix))) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    kept.push(url);
  }
  return kept;
}

async function fetchSitemapUrls() {
  const response = await fetch(`${SITE_URL}/sitemap.xml`, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) {
    throw new Error(`sitemap.xml HTTP ${response.status}`);
  }
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function submit(urlList) {
  const body = JSON.stringify({
    host: "www.parrainio.fr",
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList,
  });
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body,
    signal: AbortSignal.timeout(15_000),
  });
  if (response.ok) {
    console.log(`[indexnow] ${urlList.length} URL(s) soumise(s) (HTTP ${response.status}).`);
    return true;
  }
  let detail = "";
  try {
    detail = (await response.text()).slice(0, 300);
  } catch {
    // corps illisible : seul le code HTTP sera journalisé
  }
  console.error(
    `[indexnow] soumission refusée (HTTP ${response.status}) pour ${urlList.length} URL(s). ${detail}`.trim(),
  );
  return false;
}

async function main() {
  const rawArgs = process.argv.slice(2);
  const urls = filterIndexable(rawArgs.length > 0 ? rawArgs : await fetchSitemapUrls());
  if (urls.length === 0) {
    console.log("[indexnow] aucune URL à soumettre.");
    return;
  }
  console.log(`[indexnow] soumission de ${urls.length} URL(s) au endpoint générique…`);
  const ok = await submit(urls);
  if (!ok) process.exit(1);
}

main().catch((error) => {
  console.error("[indexnow] échec :", error instanceof Error ? error.message : error);
  process.exit(1);
});
