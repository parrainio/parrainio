import { createHmac, timingSafeEqual } from "node:crypto";
import { createHash } from "node:crypto";

/**
 * Tokens compacts signés HMAC-SHA256 pour les alertes e-mail.
 * Rien d'identifiant n'est encodé dans le token lui-même : l'e-mail est
 * haché (SHA-256) et l'offre est référencée par slug. Le secret provient
 * d'ALERTS_SIGNING_SECRET (voir lib/alertsConfig.ts). Usage serveur uniquement.
 */

export type AlertTokenPayload = { e: string; s: string };

const b64url = (buf: Buffer) => buf.toString("base64url");

function secret(): string {
  return process.env.ALERTS_SIGNING_SECRET ?? "";
}

export function alertSigningConfigured(): boolean {
  return Boolean(secret());
}

export function hashEmail(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

export function signAlertToken(payload: AlertTokenPayload): string {
  const body = b64url(Buffer.from(JSON.stringify(payload), "utf8"));
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyAlertToken(token: string): AlertTokenPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  const [body, sig] = parts;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as AlertTokenPayload;
    if (typeof payload?.e !== "string" || typeof payload?.s !== "string") return null;
    return payload;
  } catch {
    return null;
  }
}
