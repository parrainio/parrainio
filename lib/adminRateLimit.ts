/**
 * Rate limiting des connexions admin — KV + repli mémoire par instance.
 *
 * Compteur de tentatives échouées par IP (hash SHA-256, jamais l'IP en clair
 * dans le KV) avec fenêtre glissante et TTL. Stockage KV (clé
 * admin:login-fail:<hash>, TTL 900 s) pour être effectif sur toutes les
 * instances Vercel ; repli en mémoire si le KV est indisponible (protection
 * dégradée mais réelle, par instance).
 *
 * Politique : 5 échecs maximum par fenêtre de 15 minutes, puis refus avec
 * délai d'attente restant. Réinitialisation après une connexion réussie.
 */

import { createHash } from "node:crypto";
import { readAdminKvJson, writeAdminKvJson, isAdminKvConfigured } from "./adminKv";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const KV_TTL_SECONDS = Math.ceil(WINDOW_MS / 1000);

type FailureRecord = { count: number; firstAt: number };

const memoryFailures = new Map<string, FailureRecord>();

function keyFor(ip: string): string {
  const hash = createHash("sha256").update(`parrainio-admin:${ip}`).digest("hex").slice(0, 32);
  return `admin:login-fail:${hash}`;
}

function windowRecord(record: FailureRecord | null, now: number): FailureRecord | null {
  if (!record) return null;
  if (now - record.firstAt >= WINDOW_MS) return null; // fenêtre expirée
  return record;
}

async function readFailures(ip: string): Promise<FailureRecord | null> {
  const now = Date.now();
  if (isAdminKvConfigured()) {
    const stored = await readAdminKvJson<FailureRecord>(keyFor(ip));
    if (stored && typeof stored.count === "number" && typeof stored.firstAt === "number") {
      return windowRecord(stored, now);
    }
    return null;
  }
  return windowRecord(memoryFailures.get(keyFor(ip)) ?? null, now);
}

async function writeFailures(ip: string, record: FailureRecord): Promise<void> {
  if (isAdminKvConfigured()) {
    const ok = await writeAdminKvJson(keyFor(ip), record);
    if (ok) return;
    // KV en erreur : repli mémoire (best effort, cohérence par instance).
  }
  memoryFailures.set(keyFor(ip), record);
}

async function clearFailures(ip: string): Promise<void> {
  memoryFailures.delete(keyFor(ip));
  if (isAdminKvConfigured()) {
    await writeAdminKvJson(keyFor(ip), { count: 0, firstAt: 0 });
  }
}

/** Combien de tentatives restent autorisées pour cette IP ? */
export async function loginAttemptsRemaining(ip: string): Promise<number> {
  const record = await readFailures(ip);
  return Math.max(0, MAX_FAILURES - (record?.count ?? 0));
}

/** Secondes restantes avant réouverture (0 si non bloqué). */
export async function loginBlockedForSeconds(ip: string): Promise<number> {
  const record = await readFailures(ip);
  if (!record || record.count < MAX_FAILURES) return 0;
  return Math.max(1, Math.ceil((record.firstAt + WINDOW_MS - Date.now()) / 1000));
}

/** Enregistre un échec de connexion. Retourne les secondes de blocage (0 = pas encore bloqué). */
export async function recordLoginFailure(ip: string): Promise<number> {
  const now = Date.now();
  const current = (await readFailures(ip)) ?? { count: 0, firstAt: now };
  const next: FailureRecord = {
    count: current.count + 1,
    firstAt: current.firstAt > 0 ? current.firstAt : now,
  };
  await writeFailures(ip, next);
  if (next.count >= MAX_FAILURES) {
    return Math.max(1, Math.ceil((next.firstAt + WINDOW_MS - now) / 1000));
  }
  return 0;
}

/** Connexion réussie : remise à zéro du compteur. */
export async function clearLoginFailures(ip: string): Promise<void> {
  await clearFailures(ip);
}
