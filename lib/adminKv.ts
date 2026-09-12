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

type KvPipelineResult =
  | { ok: true; value: unknown[] }
  | { ok: false; reason: string };

/**
 * Déballe le résultat d'une commande de pipeline : la réponse REST d'un
 * tableau de commandes renvoie [{ result: valeur }, …] — l'élément brut est
 * donc { result } et non la valeur elle-même. Sans déballage, une lecture
 * GET recoit un objet, échoue au test « typeof === string » et retombe
 * silencieusement sur le JSON Git (données jamais relues depuis le KV).
 */
function unwrapPipelineValue(result: KvPipelineResult): unknown {
  if (!result.ok) return null;
  const element = result.value[0];
  if (element && typeof element === "object" && "result" in (element as Record<string, unknown>)) {
    return (element as { result: unknown }).result;
  }
  return element;
}

/**
 * Pipeline REST : plusieurs commandes Redis en un seul aller-retour.
 * `tag` : attache la réponse au fetch cache Next (lecture revalidable) ;
 * sans tag, la requête est no-store (écritures, exists, rate limit).
 */
async function kvRest(
  commands: (string | number)[][],
  options?: { tag?: string },
): Promise<KvPipelineResult> {
  const kv = kvEnv();
  if (!kv) return { ok: false, reason: "kv-not-configured" };
  const tag = options?.tag;
  try {
    const response = await fetch(kv.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${kv.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      ...(tag
        ? { next: { tags: [tag], revalidate: CACHE_REVALIDATE_SECONDS } }
        : { cache: "no-store" }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return { ok: false, reason: `kv-http-${response.status}` };
    const payload = (await response.json()) as { result?: unknown[]; error?: string };
    if (payload.error) return { ok: false, reason: payload.error };
    return { ok: true, value: payload.result ?? [] };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : "kv-network-error",
    };
  }
}

/** Lecture d'une clé JSON. Retourne null si absente / KV indisponible. */
export async function readAdminKvJson<T>(key: string): Promise<T | null> {
  const raw = unwrapPipelineValue(await kvRest([["GET", key]]));
  if (typeof raw !== "string" || raw.length === 0) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Lecture TAGUÉE (fetch cache Next) — sûr en rendu statique. */
async function readAdminKvJsonTagged<T>(key: string, tag: string): Promise<T | null> {
  const raw = unwrapPipelineValue(await kvRest([["GET", key]], { tag }));
  if (typeof raw !== "string" || raw.length === 0) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
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
  const result = await kvRest([["SET", key, JSON.stringify(value)]]);
  if (!result.ok) return false;
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
  // EXISTS multi-clés ne dit pas lesquelles manquent : on teste chacune
  // individuellement pour n'écrire QUE les clés absentes.
  const commands: (string | number)[][] = [];
  const perKey = await kvRest([
    ["EXISTS", OFFER_OVERRIDES_KEY],
    ["EXISTS", FEATURED_CONFIG_KEY],
    ["EXISTS", REVIEWS_KEY],
  ]);
  if (!perKey.ok) return false;
  // Éléments de pipeline : { result: 0|1 } — déballer avant le test.
  const flags = perKey.value.map(
    (element) =>
      element !== null &&
      typeof element === "object" &&
      (element as { result?: unknown }).result === 1,
  );

  if (!flags[0]) {
    const data = readGitJson<unknown>("data/offer-overrides.json");
    if (data) commands.push(["SET", OFFER_OVERRIDES_KEY, JSON.stringify(data)]);
  }
  if (!flags[1]) {
    const data = readGitJson<unknown>("data/featured-config.json");
    if (data) commands.push(["SET", FEATURED_CONFIG_KEY, JSON.stringify(data)]);
  }
  if (!flags[2]) {
    const data = readGitJson<unknown>("data/reviews.json");
    if (data) commands.push(["SET", REVIEWS_KEY, JSON.stringify(data)]);
  }

  if (commands.length > 0) {
    const written = await kvRest(commands);
    if (!written.ok) return false;
  }
  return true;
}
