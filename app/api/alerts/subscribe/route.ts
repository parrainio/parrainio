import { NextResponse } from "next/server";
import { getManagedOffer } from "@/data/managedOffers";
import { getAlertsConfig, alertsUnavailableReason } from "@/lib/alertsConfig";
import { hashEmail, signAlertToken } from "@/lib/alertTokens";
import { resolveSubscription } from "@/lib/alertSubscriptions";
import { SITE_URL } from "@/lib/siteUrl";
import { createParrainioMailer, PARRAINIO_CONTACT_EMAIL } from "@/lib/parrainioMailer";

/**
 * Création d'une alerte e-mail (serveur uniquement).
 *
 * Parcours : demande enregistrée en `pending` → email de confirmation accepté
 * par SMTP → activation après clic sur le lien signé. Les alertes de changement
 * ne partent qu'après cette confirmation.
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
  const startedAt = performance.now();
  let offerMs = 0;
  let subscriptionMs = 0;
  let smtpMs = 0;
  const timedJson = (body: unknown, status: number) =>
    NextResponse.json(body, {
      status,
      headers: {
        "Server-Timing": `offer;dur=${offerMs.toFixed(1)}, subscription;dur=${subscriptionMs.toFixed(1)}, smtp;dur=${smtpMs.toFixed(1)}, total;dur=${(performance.now() - startedAt).toFixed(1)}`,
      },
    });

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
  const mailer = createParrainioMailer();
  if (!mailer) {
    return NextResponse.json({ error: "Le service de confirmation est momentanément indisponible. Veuillez réessayer plus tard." }, { status: 503 });
  }

  const email = clean(body.email, 254).toLowerCase();
  const slug = clean(body.slug, 120);
  const consent = body.consent === true;

  if (!emailPattern.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Veuillez saisir une adresse e-mail valide." }, { status: 400 });
  }
  const offerStartedAt = performance.now();
  const offer = await getManagedOffer(slug);
  offerMs = performance.now() - offerStartedAt;
  if (!offer) {
    return NextResponse.json({ error: "Offre introuvable." }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json(
      { error: "Veuillez cocher la case de consentement pour créer votre alerte.", code: "consent" },
      { status: 400 },
    );
  }

  const emailHash = hashEmail(email);
  const subscriptionStartedAt = performance.now();
  const outcome = await resolveSubscription({ email, emailHash, slug, now: new Date() });
  subscriptionMs = performance.now() - subscriptionStartedAt;
  if (!outcome.ok) {
    return NextResponse.json({ error: alertsUnavailableReason() }, { status: 503 });
  }

  if (outcome.value.kind === "already-active") {
    return timedJson({ status: "already-subscribed" }, 200);
  }

  const token = signAlertToken({ e: emailHash, s: slug });
  const confirmationUrl = `${SITE_URL}/api/alerts/confirm?t=${encodeURIComponent(token)}`;
  const smtpStartedAt = performance.now();
  try {
    const result = await mailer.transporter.sendMail({
      from: mailer.from,
      to: email,
      replyTo: PARRAINIO_CONTACT_EMAIL,
      subject: `Confirmez votre alerte Parrainio pour ${offer.name}`,
      text: [
        "Bonjour,",
        "",
        `Vous avez demandé à recevoir les évolutions de l'offre ${offer.name} sur Parrainio.`,
        "Confirmez votre adresse et activez l'alerte en ouvrant ce lien :",
        confirmationUrl,
        "",
        "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.",
      ].join("\n"),
    });
    smtpMs = performance.now() - smtpStartedAt;
    if (!result.accepted.some((recipient: unknown) => String(recipient).toLowerCase() === email)) {
      return timedJson({ error: "Le service mail n’a pas accepté votre adresse. Votre alerte n’est pas activée." }, 502);
    }
  } catch {
    smtpMs = performance.now() - smtpStartedAt;
    return timedJson({ error: "Impossible d’envoyer l’e-mail de confirmation. Votre alerte reste inactive ; veuillez réessayer." }, 502);
  }

  return timedJson({ status: "confirmation-required" }, 200);
}
