import { NextResponse } from "next/server";
import { getManagedOffer } from "@/data/managedOffers";
import { getAlertsConfig, alertsUnavailableReason } from "@/lib/alertsConfig";
import { hashEmail } from "@/lib/alertTokens";
import { resolveSubscription } from "@/lib/alertSubscriptions";

/**
 * Création d'une alerte e-mail (serveur uniquement).
 *
 * Parcours : soumission explicite → alerte `active` immédiatement, AUCUN
 * e-mail de confirmation (l'ancien double opt-in a été retiré). Une seule
 * entrée KV par couple (e-mail, offre) : les soumissions répétées sont
 * idempotentes (aucun doublon, aucun renvoi). Les e-mails ne partent que
 * lorsqu'une offre évolue réellement (voir lib/alertRunner.ts), un seul
 * par événement et par destinataire.
 *
 * Sécurité : validation serveur complète (email, slug d'offre, consentement,
 * longueurs), honeypot, limite de débit en mémoire par IP. Consentement
 * dédié aux alertes, case décochée par défaut côté client et vérifiée côté
 * serveur. Infrastructure absente → 503 honnête, aucune persistance simulée.
 */

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (value: unknown, max: number) =>
  String(value ?? "").trim().replace(/[\u0000-\u001f\u007f]/g, "").slice(0, max);

type Bucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, Bucket>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  if (rateBuckets.size > 5000) {
    for (const [key, value] of rateBuckets) if (value.resetAt <= now) rateBuckets.delete(key);
  }
  return bucket.count > RATE_LIMIT;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (clean(body.website, 200)) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  if (rateLimited(clientIp(request))) {
    return NextResponse.json({ error: "Trop de demandes depuis cette connexion. Veuillez réessayer plus tard." }, { status: 429 });
  }

  const config = getAlertsConfig();
  if (!config.storageReady) {
    return NextResponse.json({ error: alertsUnavailableReason() }, { status: 503 });
  }

  const email = clean(body.email, 254).toLowerCase();
  const slug = clean(body.slug, 120);
  const consent = body.consent === true;

  if (!emailPattern.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Veuillez saisir une adresse e-mail valide." }, { status: 400 });
  }
  if (!getManagedOffer(slug)) {
    return NextResponse.json({ error: "Offre introuvable." }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json(
      { error: "Veuillez cocher la case de consentement pour créer votre alerte.", code: "consent" },
      { status: 400 },
    );
  }

  const emailHash = hashEmail(email);
  const outcome = await resolveSubscription({ email, emailHash, slug, now: new Date() });
  if (!outcome.ok) {
    return NextResponse.json({ error: alertsUnavailableReason() }, { status: 503 });
  }

  switch (outcome.value.kind) {
    case "created":
      return NextResponse.json({ status: "active" });
    case "reactivated":
      return NextResponse.json({ status: "active" });
    case "already-active":
      return NextResponse.json({ status: "already-subscribed" });
  }
}
