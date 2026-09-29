import { NextResponse } from "next/server";
import { getManagedOffer } from "@/data/managedOffers";
import { createParrainioMailer, PARRAINIO_CONTACT_EMAIL } from "@/lib/parrainioMailer";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value: unknown, max = 2000) => String(value ?? "").trim().replace(/[\u0000-\u001f\u007f]/g, "").slice(0, max);

export async function POST(request: Request) {
  const startedAt = performance.now();
  let offerMs = 0;
  let smtpMs = 0;
  const timedJson = (body: unknown, status: number) =>
    NextResponse.json(body, {
      status,
      headers: {
        "Server-Timing": `offer;dur=${offerMs.toFixed(1)}, smtp;dur=${smtpMs.toFixed(1)}, total;dur=${(performance.now() - startedAt).toFixed(1)}`,
      },
    });

  try {
    const body = await request.json();
    if (clean(body.website, 200)) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const slug = clean(body.slug, 120);
    const offerStartedAt = performance.now();
    const offer = await getManagedOffer(slug);
    offerMs = performance.now() - offerStartedAt;
    const firstName = clean(body.firstName, 100);
    const lastName = clean(body.lastName, 100);
    const email = clean(body.email, 254);
    const reference = clean(body.reference, 200);
    const paymentMethod = clean(body.paymentMethod, 30);
    const paymentCoordinate = clean(body.paymentCoordinate, 500);
    const message = clean(body.message, 2000);

    if (!offer || !firstName || !lastName || !emailPattern.test(email) || !["RIB", "PayPal", "Autre"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Veuillez vérifier les champs obligatoires." }, { status: 400 });
    }

    const mailer = createParrainioMailer();
    if (!mailer) {
      return NextResponse.json({ error: "Email service is not configured." }, { status: 503 });
    }

    const smtpStartedAt = performance.now();
    const result = await mailer.transporter.sendMail({ from: mailer.from, to: PARRAINIO_CONTACT_EMAIL, replyTo: email, subject: `Nouvelle demande de reverse Parrainio — ${offer.name}`, text: `Nouvelle demande de reverse Parrainio\n\nOffre : ${offer.name}\n\nPrénom : ${firstName}\nNom : ${lastName}\nAdresse e-mail : ${email}\nNuméro de contrat / référence : ${reference || "Non renseigné"}\nMode de paiement : ${paymentMethod}\nCoordonnées de paiement : ${paymentCoordinate || "Non renseignées"}\nMessage : ${message || "Aucun message"}` });
    smtpMs = performance.now() - smtpStartedAt;
    if (!result.accepted.some((recipient: unknown) => String(recipient).toLowerCase() === PARRAINIO_CONTACT_EMAIL)) {
      return timedJson({ error: "Le service mail n’a pas accepté votre demande." }, 502);
    }
    return timedJson({ ok: true }, 200);
  } catch {
    return timedJson({ error: "Impossible d’envoyer votre demande pour le moment. Veuillez réessayer dans quelques instants." }, 500);
  }
}
