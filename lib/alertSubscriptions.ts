import { getAlertsConfig, alertsUnavailableReason } from "./alertsConfig";
import { alertSigningConfigured } from "./alertTokens";

/**
 * Abonnements aux alertes d'offre — modèle de données.
 *
 * Une entrée = un couple (email, offre). Aucune donnée superflue : pas de
 * nom, pas de téléphone, pas de contenu d'offre dupliqué (seul le slug est
 * stocké — les libellés sont résolus au moment de l'envoi).
 *
 * Clé KV : `alert:<hash-email>:<slug>` → subscription. Hash SHA-256 de
 * l'e-mail (l'adresse en clair n'est pas la clé ; elle est stockée une fois,
 * chiffrable plus tard sans migration de clé). Une clé par couple (e-mail,
 * offre) : une soumission ne peut jamais créer de doublon. Statuts :
 * `active` (alerte créée par une soumission explicite) et `unsubscribed`.
 * `pending` n'est plus créé (l'ancien double opt-in a été retiré) mais
 * reste lu pour migrer proprement d'éventuelles anciennes entrées.
 *
 * IMPORTANT (chantier) : la persistance n'existe que si les variables
 * ALERTS_KV_REST_API_URL / ALERTS_KV_REST_API_TOKEN sont configurées. Sans
 * elles, chaque fonction retourne l'erreur `storage-unavailable` — aucune
 * simulation, aucun localStorage, aucun fichier JSON.
 */

export type AlertSubscriptionStatus = "active" | "unsubscribed" | "pending";

export type AlertSubscription = {
  email: string;
  slug: string;
  /** Consentement dédié aux alertes (case à cocher décochée par défaut, vérifiée côté serveur). */
  consent: boolean;
  status: AlertSubscriptionStatus;
  /** Date de création de la demande (ISO). */
  createdAt: string;
  /** Date d'activation de l'alerte (ISO) — posée dès la soumission explicite. */
  activatedAt: string | null;
  /** Date de désabonnement (ISO), si applicable. */
  unsubscribedAt: string | null;
};

export type SubscribeOutcome =
  | { kind: "created" }
  | { kind: "reactivated" }
  | { kind: "already-active" }
  | { kind: "unavailable"; reason: string };

export type StorageResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: "storage-unavailable" | "storage-error"; reason?: string };

const PREFIX = "alert:";

function kvEnv() {
  const url = process.env.ALERTS_KV_REST_API_URL;
  const token = process.env.ALERTS_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

function storageUnavailableReason(): string {
  return getAlertsConfig().kvConfigured ? alertsUnavailableReason() : alertsUnavailableReason();
}

async function rest<T>(command: (string | number)[]): Promise<StorageResult<T>> {
  const kv = kvEnv();
  if (!kv) return { ok: false, error: "storage-unavailable" };
  try {
    const response = await fetch(kv.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${kv.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(command),
      cache: "no-store",
    });
    if (!response.ok) return { ok: false, error: "storage-error", reason: `kv-http-${response.status}` };
    const payload = (await response.json()) as { result?: T | string; error?: string };
    if (payload.error) return { ok: false, error: "storage-error", reason: payload.error };
    let value = payload.result;
    if (typeof value === "string") {
      try { value = JSON.parse(value) as T; } catch { /* valeur non-JSON */ }
    }
    return { ok: true, value: value as T };
  } catch (error) {
    return { ok: false, error: "storage-error", reason: error instanceof Error ? error.message : "network" };
  }
}

/** Pipeline REST : plusieurs commandes en un aller-retour. */
async function restMany<T>(commands: (string | number)[][]): Promise<StorageResult<T[]>> {
  const kv = kvEnv();
  if (!kv) return { ok: false, error: "storage-unavailable" };
  try {
    const response = await fetch(kv.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${kv.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      cache: "no-store",
    });
    if (!response.ok) return { ok: false, error: "storage-error", reason: `kv-http-${response.status}` };
    const payload = (await response.json()) as { result?: (T | string)[]; error?: string };
    if (payload.error) return { ok: false, error: "storage-error", reason: payload.error };
    const values = (payload.result ?? []).map((item) => {
      if (typeof item === "string") {
        try { return JSON.parse(item) as T; } catch { return item as T; }
      }
      return item as T;
    });
    return { ok: true, value: values };
  } catch (error) {
    return { ok: false, error: "storage-error", reason: error instanceof Error ? error.message : "network" };
  }
}

function keyFor(emailHash: string, slug: string) {
  return `${PREFIX}${emailHash}:${slug}`;
}

export async function getSubscription(emailHash: string, slug: string): Promise<StorageResult<AlertSubscription | null>> {
  const result = await rest<AlertSubscription | null>(["GET", keyFor(emailHash, slug)]);
  return result;
}

export async function saveSubscription(subscription: AlertSubscription, emailHash: string): Promise<StorageResult<AlertSubscription>> {
  const result = await rest<AlertSubscription>(["SET", keyFor(emailHash, subscription.slug), JSON.stringify(subscription)]);
  return result;
}

/**
 * Résout une demande de souscription (appelée APRÈS validation serveur et
 * vérification du consentement). Activation IMMÉDIATE : toute soumission
 * explicite crée (ou réactive) l'alerte en `active`, sans e-mail de
 * confirmation et sans renvoi. Ne crée jamais de doublon : une entrée
 * existante `active` reste inchangée (aucune réécriture) ; une entrée
 * `pending` (historique) ou `unsubscribed` passe à `active` sur la même clé.
 */
export async function resolveSubscription(params: {
  email: string;
  emailHash: string;
  slug: string;
  now: Date;
}): Promise<StorageResult<SubscribeOutcome>> {
  const config = getAlertsConfig();
  if (!config.storageReady) return { ok: false, error: "storage-unavailable" };

  const existing = await getSubscription(params.emailHash, params.slug);
  if (!existing.ok) return existing;

  const now = params.now.toISOString();
  const previous = existing.value;

  if (previous && previous.status === "active") {
    return { ok: true, value: { kind: "already-active" } };
  }

  const next: AlertSubscription = {
    email: params.email,
    slug: params.slug,
    consent: true,
    status: "active",
    createdAt: previous?.createdAt ?? now,
    activatedAt: now,
    unsubscribedAt: null,
  };
  const saved = await saveSubscription(next, params.emailHash);
  if (!saved.ok) return saved;
  return { ok: true, value: previous?.status === "unsubscribed" ? { kind: "reactivated" } : { kind: "created" } };
}

export async function performUnsubscribe(emailHash: string, slug: string): Promise<StorageResult<AlertSubscription | null>> {
  const existing = await getSubscription(emailHash, slug);
  if (!existing.ok) return existing;
  const previous = existing.value;
  if (!previous) return { ok: true, value: null };
  const next: AlertSubscription = { ...previous, status: "unsubscribed", unsubscribedAt: new Date().toISOString() };
  const saved = await saveSubscription(next, emailHash);
  if (!saved.ok) return saved;
  return { ok: true, value: next };
}

export function alertStorageReady(): boolean {
  return getAlertsConfig().storageReady && alertSigningConfigured();
}

/**
 * Liste les abonnements actifs d'une offre (SCAN par préfixe, paging par
 * curseur — aucun index séparé à maintenir). Retourne les souscriptions
 * `active` uniquement : une alerte compte si elle a été créée par une
 * soumission explicite (les entrées désinscrites et l'historique `pending`
 * non resoumis ne reçoivent jamais d'e-mail).
 */
export async function listActiveSubscribers(slug: string): Promise<StorageResult<AlertSubscription[]>> {
  const config = getAlertsConfig();
  if (!config.storageReady) return { ok: false, error: "storage-unavailable" };

  const pattern = `${PREFIX}*:${slug}`;
  const subscriptions: AlertSubscription[] = [];
  let cursor = "0";
  do {
    const scan = await rest<[string, string[]]>(["SCAN", cursor, "MATCH", pattern, "COUNT", 100]);
    if (!scan.ok) return scan;
    cursor = scan.value[0] ?? "0";
    const keys = scan.value[1] ?? [];
    if (keys.length > 0) {
      const pipeline = await restMany<AlertSubscription | null>(keys.map((key) => ["GET", key]));
      if (!pipeline.ok) return pipeline;
      for (const item of pipeline.value) {
        if (item && item.status === "active" && item.slug === slug) subscriptions.push(item);
      }
    }
  } while (cursor !== "0");
  return { ok: true, value: subscriptions };
}
