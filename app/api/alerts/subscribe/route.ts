import { NextResponse } from "next/server";
import { getManagedOffer } from "@/data/managedOffers";
import { getAlertsConfig, alertsUnavailableReason } from "@/lib/alertsConfig";
import { hashEmail, signAlertToken, alertSigningConfigured } from "@/lib/alertTokens";
import { resolveSubscription } from "@/lib/alertSubscriptions";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * Création d'une alerte e-mail (serveur uniquement).
 *
 * Sécurité : validation serveur complète (email, slug d'offre, consentement,
 * longueurs), honeypot, limite de débit en mémoire par IP (complément
 * raisonnable ; le KV managé peut absorber un quota partagé plus tard).
 * Consentement dédié aux alertes, case à cocher décochée par défaut côté
 * client et vérifiée côté serveur. Double opt-in si le SMTP est configuré :
 * sans SMTP, la souscription reste `pending` et l'UI le dit clairement.
 * Infrastructure absente → 503 honnête, aucune persistance simulée.
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

function smtpEnv() {
  const { SMTP_HOST: host, SMTP_PORT: port, SMTP_USER: user, SMTP_PASSWORD: password } = process.env;
  if (!host || !port || !user || !password) return null;
  return { host, port: Number(port), user, password };
}

async function sendConfirmationEmail(params: { email: string; offerName: string; token: string }): Promise<boolean> {
  const smtp = smtpEnv();
  if (!smtp) return false;
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.default.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: { user: smtp.user, pass: smtp.password },
  });
  try {
    await transporter.sendMail({
      from: smtp.user,
      to: params.email,
      replyTo: "parrainage@parrainio.fr",
      subject: `Confirmez votre alerte sur l'offre ${params.offerName}`,
      text: [
        "Bonjour,",
        "",
        `Vous avez demandé une alerte e-mail pour l'offre ${params.offerName} sur Parrainio.`,
        "Confirmez votre demande pour activer l'alerte :",
        `${SITE_URL}/api/alerts/confirm?t=${encodeURIComponent(params.token)}`,
        "",
        "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message : aucune alerte ne sera envoyée.",
        `Se désabonner de cette alerte : ${SITE_URL}/api/alerts/unsubscribe?t=${encodeURIComponent(params.token)}`,
      ].join("\n"),
    });
    return true;
  } catch {
    return false;
  }
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
  if (!alertSigningConfigured()) {
    return NextResponse.json({ error: alertsUnavailableReason() }, { status: 503 });
  }

  const emailHash = hashEmail(email);
  const outcome = await resolveSubscription({ email, emailHash, slug, now: new Date() });
  if (!outcome.ok) {
    return NextResponse.json({ error: alertsUnavailableReason() }, { status: 503 });
  }

  if (outcome.value.kind === "already-active") {
    return NextResponse.json({ status: "already-subscribed" });
  }

  const offer = getManagedOffer(slug)!;
  const smtpReady = config.smtpConfigured;
  if (smtpReady && (outcome.value.kind === "created" || outcome.value.kind === "reactivated" || outcome.value.kind === "pending-resent")) {
    const token = signAlertToken({ e: emailHash, s: slug });
    const sent = await sendConfirmationEmail({ email, offerName: offer.name, token });
    if (!sent) {
      return NextResponse.json({ error: "Impossible d'envoyer l'e-mail de confirmation pour le moment. Veuillez réessayer." }, { status: 502 });
    }
  }

  if (outcome.value.kind === "pending-resent") {
    return NextResponse.json({ status: smtpReady ? "confirmation-pending" : "pending-no-email" });
  }
  return NextResponse.json({ status: smtpReady ? "confirmation-pending" : "pending-no-email" });
}
