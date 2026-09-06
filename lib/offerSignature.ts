import { getAlertsConfig } from "./alertsConfig";

/**
 * Historique des signatures d'offres — modèle de données.
 *
 * Une entrée = une offre. `signature` = empreinte des champs significatifs
 * (prime filleul, prime parrain, reverse Parrainio, conditions importantes,
 * code/lien de parrainage, disponibilité). `changedFields` = libellés des
 * champs modifiés au dernier changement détecté.
 *
 * Stockage : KV managé (Vercel Upstash REST). Une clé par offre
 * `alertsig:<slug>` → { signature, lastNotifiedSignature?, checkedAt,
 * changedFields }. N'est créé qu'au premier `check` — le premier passage
 * est toujours « référence ». `lastNotifiedSignature` = dernière signature
 * dont la notification a été prise en charge (verrou idempotent : rejouer
 * le même état ne renvoie aucun e-mail ; absence = héritage des entrées
 * créées avant ce mécanisme).
 *
 * IMPORTANT (chantier) : les lignes qui suivent décrivent le format ; la
 * persistance réelle n'existe que si les variables ALERTS_KV_REST_API_URL /
 * ALERTS_KV_REST_API_TOKEN sont configurées (voir lib/alertsConfig.ts).
 */

export type OfferSignatureRecord = {
  signature: string;
  /** Dernière signature dont la notification a été prise en charge. */
  lastNotifiedSignature?: string;
  checkedAt: string;
  changedFields: string[];
};

const PREFIX = "alertsig:";

type RestResult<T> = { ok: true; value: T } | { ok: false; error: string };

function kvEnv() {
  const url = process.env.ALERTS_KV_REST_API_URL;
  const token = process.env.ALERTS_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

async function rest<T>(command: (string | number)[], init?: RequestInit): Promise<RestResult<T>> {
  const kv = kvEnv();
  if (!kv) return { ok: false, error: "kv-not-configured" };
  try {
    const response = await fetch(kv.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${kv.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(command),
      cache: "no-store",
      signal: init?.signal,
    });
    if (!response.ok) return { ok: false, error: `kv-http-${response.status}` };
    const payload = (await response.json()) as { result?: T | string; error?: string };
    if (payload.error) return { ok: false, error: payload.error };
    let value = payload.result;
    if (typeof value === "string") {
      try { value = JSON.parse(value) as T; } catch { /* valeur non-JSON (ex. null) */ }
    }
    return { ok: true, value: value as T };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "kv-network-error" };
  }
}

export type SignatureLookup =
  | { ok: true; value: OfferSignatureRecord | null }
  | { ok: false; error: string };

export async function loadSignature(slug: string): Promise<SignatureLookup> {
  return rest<OfferSignatureRecord | null>(["GET", PREFIX + slug]);
}

export async function saveSignature(slug: string, record: OfferSignatureRecord): Promise<boolean> {
  const result = await rest(["SET", PREFIX + slug, JSON.stringify(record)]);
  return result.ok;
}
