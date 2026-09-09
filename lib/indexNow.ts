/**
 * IndexNow — soumission des URLs nouvelles/modifiées aux moteurs partenaires
 * (Bing, Yandex, Seznam, Naver…), déclenchée après chaque déploiement.
 *
 * Conception :
 * - source de vérité : les `outcomes` retournés par runOfferAlertCheck()
 *   (déjà idempotents — rejouer un déploiement → `no-change` → 0 soumission) ;
 * - production uniquement (VERCEL_ENV === "production") : les hôtes
 *   local/preview ne servent pas le domaine canonique, on ne ping donc pas ;
 * - URLs strictement canoniques : construites avec SITE_URL
 *   (https://www.parrainio.fr) et les mêmes générateurs que le sitemap
 *   (getManagedOffers) ; aucune URL inexistante, aucune redirection,
 *   aucune page noindex (mes-favoris, favoris, admin, api) n'est soumise ;
 * - envoi groupé : toutes les URLs partent en un seul POST api.indexnow.org ;
 * - fire-and-forget honnête : timeout court, résultat journalisé (202/200
 *   accepté, 403 clé invalide, 429 quota, autre = erreur), jamais bloquant
 *   pour les alertes ni pour le démarrage du serveur ;
 * - aucune donnée d'offre, aucun sitemap, aucune balise SEO modifiés.
 */

import { SITE_URL } from "@/lib/siteUrl";

/** Pages volontairement hors index — jamais soumises à IndexNow.
 *  EXACTES : mes-favoris (metadata robots noindex), favoris (contenu 100 %
 *  client, sans valeur SEO). ARBORESCENCES (préfixe) : /admin et /api
 *  (Disallow robots.txt). */
const NON_INDEXABLE_EXACT: ReadonlySet<string> = new Set([
  "/mes-favoris",
  "/favoris",
]);
const NON_INDEXABLE_PREFIXES: readonly string[] = ["/admin", "/api"];

/** Clé IndexNow publique (sert uniquement à prouver la propriété du site).
 *  Fichier de validation hébergé : public/{INDEXNOW_KEY}.txt */
export const INDEXNOW_KEY = "9406afe85af4263921ca07832e191e65";

/** Endpoint générique IndexNow (route les moteurs partenaires). */
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/** Est-ce que ce module doit agir ? Production uniquement + clé présente. */
export function isIndexNowEnabled(): boolean {
  return process.env.VERCEL_ENV === "production" && INDEXNOW_KEY.length > 0;
}

/** Filtre strict : ne garde que des URLs canoniques indexables du site.
 *  Rejette tout ce qui n'est pas https://www.parrainio.fr (localhost,
 *  preview, apex redirigé…), les pages noindex et les doublons. */
export function filterIndexableUrls(urls: readonly (string | undefined | null)[]): string[] {
  const seen = new Set<string>();
  const kept: string[] = [];
  for (const raw of urls) {
    if (!raw) continue;
    if (!raw.startsWith(`${SITE_URL}/`) && raw !== SITE_URL) continue;
    const path = raw.slice(SITE_URL.length); // ex. "/mes-favoris", "/api/x"
    if (NON_INDEXABLE_EXACT.has(path)) continue;
    if (NON_INDEXABLE_PREFIXES.some((prefix) => path.startsWith(prefix))) continue;
    if (seen.has(raw)) continue;
    seen.add(raw);
    kept.push(raw);
  }
  return kept;
}

/** Soumission groupée IndexNow. Retourne le code HTTP (ou null si non envoyé). */
export async function submitIndexNow(urls: readonly string[]): Promise<number | null> {
  if (!isIndexNowEnabled()) return null;
  const urlList = filterIndexableUrls(urls);
  if (urlList.length === 0) return null;

  const body = JSON.stringify({
    host: "www.parrainio.fr",
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  });

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    // 200/202 : accepté ; 403 : clé invalide ; 422 : URL hors hôte ;
    // 429 : quota — on journalise tout, sans jamais lever.
    if (!response.ok) {
      console.warn(`[indexnow] soumission refusée (HTTP ${response.status}) pour ${urlList.length} URL(s).`);
    } else {
      console.info(`[indexnow] ${urlList.length} URL(s) soumise(s) (HTTP ${response.status}).`);
    }
    return response.status;
  } catch (error) {
    console.warn(
      "[indexnow] soumission impossible :",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

export type IndexNowTarget = {
  slug: string;
  status: string;
  changedFields: readonly string[];
};

/** Construit la liste d'URLs à soumettre à partir des outcomes d'alertes :
 *  - nouvelle offre (first-reference) → sa fiche ;
 *  - offre modifiée (changedFields.length > 0) → fiche + listes publiques
 *    qui l'affichent (/offres, classement) ;
 *  - tout le reste (no-change, storage-unavailable…) → rien. */
export function urlsFromAlertOutcomes(outcomes: readonly IndexNowTarget[]): string[] {
  const urls: string[] = [];
  for (const outcome of outcomes) {
    if (outcome.status === "first-reference") {
      urls.push(`${SITE_URL}/offres/${outcome.slug}`);
    } else if (outcome.changedFields.length > 0) {
      urls.push(
        `${SITE_URL}/offres/${outcome.slug}`,
        `${SITE_URL}/offres`,
        `${SITE_URL}/classement-primes-parrainage`,
      );
    }
  }
  return filterIndexableUrls(urls);
}
