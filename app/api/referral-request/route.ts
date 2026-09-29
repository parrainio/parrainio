import { NextResponse } from "next/server";
import { getManagedOffer } from "@/data/managedOffers";
import { createParrainioMailer, PARRAINIO_CONTACT_EMAIL } from "@/lib/parrainioMailer";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (value: unknown, max: number) =>
  (typeof value === "string" ? value : "")
    .trim()
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .slice(0, max);

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
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (clean(body.website, 200)) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: "Trop de demandes depuis cette connexion. Veuillez réessayer plus tard." },
      { status: 429 },
    );
  }

  const firstName = clean(body.firstName, 100);
  const lastName = clean(body.lastName, 100);
  const email = clean(body.email, 254);
  const slug = clean(body.slug, 120);

  if (!firstName || !lastName || !emailPattern.test(email) || email.length > 254 || !slug) {
    return NextResponse.json(
      { error: "Veuillez renseigner un prénom, un nom et une adresse e-mail valide." },
      { status: 400 },
    );
  }

  const offer = await getManagedOffer(slug);
  if (!offer) {
    return NextResponse.json({ error: "Offre introuvable." }, { status: 400 });
  }

  const mailer = createParrainioMailer();
  if (!mailer) {
    return NextResponse.json(
      { error: "L’envoi des demandes est temporairement indisponible. Veuillez réessayer plus tard." },
      { status: 503 },
    );
  }

  try {
    await mailer.transporter.sendMail({
      from: mailer.from,
      to: PARRAINIO_CONTACT_EMAIL,
      replyTo: email,
      subject: `Demande de lien de parrainage — ${offer.name}`,
      text: [
        "Nouvelle demande de lien de parrainage sur Parrainio",
        "",
        `Offre : ${offer.name}`,
        `Slug : ${offer.slug}`,
        `Prénom : ${firstName}`,
        `Nom : ${lastName}`,
        `Adresse e-mail : ${email}`,
      ].join("\n"),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Impossible d’envoyer votre demande pour le moment. Veuillez réessayer dans quelques instants." },
      { status: 500 },
    );
  }
}
