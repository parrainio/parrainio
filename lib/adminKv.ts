/**
 * Stockage persistant des données administrables — KV REST (Upstash).
 *
 * Réutilise EXACTEMENT l'infrastructure et le pattern d'accès déjà en
 * production pour les alertes (ALERTS_KV_REST_API_URL / TOKEN, fetch POST,
 * commandes JSON) — aucune nouvelle variable, aucun SDK, aucune nouvelle
 * base. Les clés utilisent le préfixe « admin: » pour être strictement
 * disjointes des clés alertes (« alert: », « alertsig: »).
 *
 * Clés :
 *   admin:offer-overrides   → OfferOverrides (map slug → override, ~120 Ko)
 *   admin:featured-config   → { featuredOfferSlugs: string[] }
 *   admin:reviews           → { reviews: Review[] }
 *   admin:login-fail:<hash> → compteur de connexions échouées
 *
 * Garantie de non-perte de données :
 *   - seed idempotent : au premier accès, chaque clé ABSENTE est créée
 *     depuis le JSON Git correspondant. Une clé déjà présente n'est JAMAIS
 *     écrasée par le seed (les modifications admin sont préservées).
 *   - les JSON Git restent en place : en cas de KV indisponible, la lecture
 *     retombe sur le fichier (comportement historique) — le site continue
 *     de servir les données du dernier déploiement.
 *   - rollback : supprimer les variables KV (ou revert du code de lecture)
 *     rend instantanément les JSON Git sources de vérité.
 *
 * Cache : les lectures passent par le fetch cache Next avec TAGS
 * (`next: { tags, revalidate }`) — pattern documenté, compatible rendu
 * statique (un fetch no-store pendant le rendu statique ferait lever
 * « Page changed from static to dynamic »). Chaque écriture admin appelle
 * revalidateTag() : les pages concernées sont régénérées immédiatement,
 * en complément des revalidatePath() de l'action.
 *
 * Ce module est strictement serveur : aucune credential n'atteint le client.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { revalidateTag } from "next/cache";

const OFFER_OVERRIDES_KEY = "admin:offer-overrides";
const FEATURED_CONFIG_KEY = "admin:featured-config";
const REVIEWS_KEY = "admin:reviews";

export const ADMIN_KV_KEYS = {
  offerOverrides: OFFER_OVERRIDES_KEY,
  featuredConfig: FEATURED_CONFIG_KEY,
  reviews: REVIEWS_KEY,
} as const;

/** Tags invalidés par revalidateTag à chaque écriture admin. */
export const ADMIN_KV_TAGS = {
  offerOverrides: "admin-offer-overrides",
  featuredConfig: "admin-featured-config",
  reviews: "admin-reviews",
} as const;

const TAG_BY_KEY: { [key: string]: string } = {
  [OFFER_OVERRIDES_KEY]: ADMIN_KV_TAGS.offerOverrides,
  [FEATURED_CONFIG_KEY]: ADMIN_KV_TAGS.featuredConfig,
  [REVIEWS_KEY]: ADMIN_KV_TAGS.reviews,
};

/** Fraîcheur maximale sans action admin (bornée à 60 s). */
const CACHE_REVALIDATE_SECONDS = 60;

/** KV configuré ? Mêmes variables que le système d'alertes. */
export function isAdminKvConfigured(): boolean {
  return Boolean(
    process.env.ALERTS_KV_REST_API_URL && process.env.ALERTS_KV_REST_API_TOKEN,
  );
}

function kvEnv() {
  const url = process.env.ALERTS_KV_REST_API_URL;
  const token = process.env.ALERTS_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

type KvResult =
  | { ok: true; value: unknown }
  | { ok: false; reason: string };

/**
 * Commande REST UNIQUE — format identique au système d'alertes
 * (lib/alertSubscriptions.ts), seul code prouvé contre le vrai Upstash en
 * production : corps = tableau plat (["GET", clé]), réponse { result: scalaire }.
 *
 * Historique (bug EROFS / React #441 en production) : l'ancienne
 * implémentation envoyait un PIPELINE (tableau de tableaux) même pour une
 * commande unique. En production Vercel, l'écriture SET échouait
 * silencieusement (persisted=false) et le repli fichier tentait d'écrire le
 * JSON Git sur le FS lecture-seule → EROFS → #441. Les lectures utilisent
 * le même format plat : un pipeline défaillant aurait rendu toute lecture KV
 * muette (repli Git silencieux, modifications jamais servies).
 *
 * `tag` : attache la réponse au fetch cache Next (lecture revalidable) ;
 * sans tag, la requête est no-store (écritures, exists, rate limit).
 */
async function kvRestScalar(
  command: (string | number)[],
  options?: { tag?: string },
): Promise<KvResult> {
  const kv = kvEnv();
  if (!kv) return { ok: false, reason: "kv-not-configured" };
  const tag = options?.tag;
  try {
    const response = await fetch(kv.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${kv.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(command),
      ...(tag
        ? { next: { tags: [tag], revalidate: CACHE_REVALIDATE_SECONDS } }
        : { cache: "no-store" }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return { ok: false, reason: `kv-http-${response.status}` };
    const payload = (await response.json()) as { result?: unknown; error?: string };
    if (payload.error) return { ok: false, reason: payload.error };
    return { ok: true, value: payload.result };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : "kv-network-error",
    };
  }
}

/** Corps de réponse GET = string JSON → objet typé ; sinon null. */
function parseKvJson<T>(result: KvResult): T | null {
  if (!result.ok || typeof result.value !== "string" || result.value.length === 0) return null;
  try {
    return JSON.parse(result.value) as T;
  } catch {
    return null;
  }
}

/** Lecture d'une clé JSON. Retourne null si absente / KV indisponible. */
export async function readAdminKvJson<T>(key: string): Promise<T | null> {
  return parseKvJson<T>(await kvRestScalar(["GET", key]));
}

/** Lecture TAGUÉE (fetch cache Next) — sûr en rendu statique. */
async function readAdminKvJsonTagged<T>(key: string, tag: string): Promise<T | null> {
  return parseKvJson<T>(await kvRestScalar(["GET", key], { tag }));
}

export async function getAdminOfferOverridesCached(): Promise<Record<string, unknown> | null> {
  return readAdminKvJsonTagged<Record<string, unknown>>(
    OFFER_OVERRIDES_KEY,
    ADMIN_KV_TAGS.offerOverrides,
  );
}

export async function getAdminFeaturedConfigCached(): Promise<Record<string, unknown> | null> {
  return readAdminKvJsonTagged<Record<string, unknown>>(
    FEATURED_CONFIG_KEY,
    ADMIN_KV_TAGS.featuredConfig,
  );
}

export async function getAdminReviewsCached(): Promise<Record<string, unknown> | null> {
  return readAdminKvJsonTagged<Record<string, unknown>>(REVIEWS_KEY, ADMIN_KV_TAGS.reviews);
}

/**
 * Écriture d'une valeur JSON + invalidation du tag correspondant
 * (publication immédiate des pages qui consomment la donnée).
 * Retourne false si le KV est indisponible/erreur.
 *
 * revalidateTag avec le profil inline { expire: 0 } = expiration immédiate
 * (la branche runtime « cacheLife.expire === 0 » marque la route
 * revalidée, comme revalidatePath). Les profils intégrés (« max »,
 * « minutes »…) sont du stale-while-revalidate : l'entrée marquée stale
 * reste servie jusqu'à la fenêtre stale — la page publique ne refléterait
 * la modification qu'après coup (constaté en QA). Valide en Server Action
 * ET en Route Handler (l'endpoint public /api/reviews écrit aussi une clé
 * taguée).
 */
export async function writeAdminKvJson(key: string, value: unknown): Promise<boolean> {
  const result = await kvRestScalar(["SET", key, JSON.stringify(value)]);
  if (!result.ok) {
    // Raison journalisée (jamais de secret) : c'est elle qui permettra de
    // lire la cause exacte d'un échec d'écriture dans les logs Vercel.
    console.error(`[admin-kv] écriture KV impossible (${key}) :`, result.reason);
    return false;
  }
  const tag = TAG_BY_KEY[key];
  if (tag) {
    try {
      revalidateTag(tag, { expire: 0 });
    } catch {
      // Hors contexte action/route : ignoré — le TTL 60 s borne la fraîcheur.
    }
  }
  return true;
}

// ── Seed idempotent depuis les JSON Git ──────────────────────────────────────

function readGitJson<T>(relativePath: string): T | null {
  const path = join(process.cwd(), relativePath);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return null;
  }
}

let seedPromise: Promise<boolean> | null = null;

/**
 * Garantit que les 3 clés admin existent dans le KV. Chaque clé ABSENTE est
 * initialisée depuis le JSON Git correspondant (idempotent : rejouer ne
 * ré-écrase jamais une clé existante, donc jamais les modifications admin).
 * Une seule exécution par instance (single-flight). Retourne true si le KV
 * est prêt (configuré + seed sans erreur bloquante), false sinon.
 *
 * IMPORTANT : à n'appeler QUE depuis des contextes dynamiques (actions,
 * routes API) — typiquement les chemins d'ÉCRITURE. Le seed émet des fetch
 * no-store, interdits pendant le rendu : un appel depuis un lecteur rendu
 * dans une page statique lèverait « Page changed from static to dynamic »
 * (surface client : Minified React error #441). Les lecteurs de rendu lisent
 * le KV via le cache tagué et retombent sur le JSON Git sans seed.
 */
export function ensureAdminKvSeeded(): Promise<boolean> {
  if (!isAdminKvConfigured()) return Promise.resolve(false);
  if (!seedPromise) {
    seedPromise = seedOnce().catch(() => false);
  }
  return seedPromise;
}

async function seedOnce(): Promise<boolean> {
  // Chaque clé testée individuellement (commande plate, format alertes)
  // pour n'écrire QUE les clés absentes — idempotent.
  const [overridesExists, featuredExists, reviewsExists] = await Promise.all([
    kvRestScalar(["EXISTS", OFFER_OVERRIDES_KEY]),
    kvRestScalar(["EXISTS", FEATURED_CONFIG_KEY]),
    kvRestScalar(["EXISTS", REVIEWS_KEY]),
  ]);
  if (!overridesExists.ok || !featuredExists.ok || !reviewsExists.ok) return false;

  if (overridesExists.value !== 1) {
    const data = readGitJson<unknown>("data/offer-overrides.json");
    if (data) {
      const written = await kvRestScalar(["SET", OFFER_OVERRIDES_KEY, JSON.stringify(data)]);
      if (!written.ok) return false;
    }
  }
  if (featuredExists.value !== 1) {
    const data = readGitJson<unknown>("data/featured-config.json");
    if (data) {
      const written = await kvRestScalar(["SET", FEATURED_CONFIG_KEY, JSON.stringify(data)]);
      if (!written.ok) return false;
    }
  }
  if (reviewsExists.value !== 1) {
    const data = readGitJson<unknown>("data/reviews.json");
    if (data) {
      const written = await kvRestScalar(["SET", REVIEWS_KEY, JSON.stringify(data)]);
      if (!written.ok) return false;
    }
  }
  return true;
}
