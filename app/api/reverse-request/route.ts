import { NextResponse } from "next/server";
import { getManagedOffer } from "@/data/managedOffers";

const recipient = "parrainage@parrainio.fr";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value: unknown, max = 2000) => String(value ?? "").trim().replace(/[\u0000-\u001f\u007f]/g, "").slice(0, max);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (clean(body.website, 200)) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const slug = clean(body.slug, 120);
    const offer = getManagedOffer(slug);
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

    const { SMTP_HOST: host, SMTP_PORT: port, SMTP_USER: user, SMTP_PASSWORD: password } = process.env;
    if (!host || !port || !user || !password) {
      return NextResponse.json({ error: "Email service is not configured." }, { status: 503 });
    }

    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({ host, port: Number(port), secure: port === "465", auth: { user, pass: password } });
    await transporter.sendMail({ from: user, to: recipient, replyTo: email, subject: `Nouvelle demande de reverse Parrainio — ${offer.name}`, text: `Nouvelle demande de reverse Parrainio\n\nOffre : ${offer.name}\n\nPrénom : ${firstName}\nNom : ${lastName}\nAdresse e-mail : ${email}\nNuméro de contrat / référence : ${reference || "Non renseigné"}\nMode de paiement : ${paymentMethod}\nCoordonnées de paiement : ${paymentCoordinate || "Non renseignées"}\nMessage : ${message || "Aucun message"}` });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Impossible d’envoyer votre demande pour le moment. Veuillez réessayer dans quelques instants." }, { status: 500 });
  }
}
