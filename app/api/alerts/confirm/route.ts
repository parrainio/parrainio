import { NextResponse } from "next/server";
import { confirmSubscription } from "@/lib/alertSubscriptions";
import { verifyAlertToken } from "@/lib/alertTokens";
import { getManagedOffer } from "@/data/managedOffers";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

function html(title: string, message: string, form = "") {
  return new NextResponse(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escapeHtml(title)} | Parrainio</title></head><body><main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p>${form}<p><a href="/">Retour sur Parrainio</a></p></main></body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex, nofollow" } },
  );
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("t") ?? "";
  const payload = verifyAlertToken(token);
  if (!payload) return html("Lien invalide", "Ce lien de confirmation est invalide ou incomplet.");

  const offer = await getManagedOffer(payload.s);
  if (!offer) return html("Offre introuvable", "L'offre associée à cette alerte n'existe plus.");

  const form = `<form method="post"><input type="hidden" name="t" value="${escapeHtml(token)}"><button type="submit">Confirmer mon adresse</button></form>`;
  return html("Confirmer votre alerte", `Confirmez votre adresse pour recevoir les évolutions de l'offre ${offer.name}.`, form);
}

export async function POST(request: Request) {
  let token = "";
  try {
    token = String((await request.formData()).get("t") ?? "");
  } catch {
    return html("Lien invalide", "Ce lien de confirmation est invalide ou incomplet.");
  }

  const payload = verifyAlertToken(token);
  if (!payload) return html("Lien invalide", "Ce lien de confirmation est invalide ou incomplet.");

  const offer = await getManagedOffer(payload.s);
  if (!offer) return html("Offre introuvable", "L'offre associée à cette alerte n'existe plus.");

  const outcome = await confirmSubscription(payload.e, payload.s);
  if (!outcome.ok) {
    return html("Service indisponible", "Votre adresse n'a pas pu être confirmée. Veuillez réessayer plus tard.");
  }
  if (!outcome.value) {
    return html("Alerte introuvable", "Cette demande n'est plus en attente de confirmation.");
  }

  return html("Alerte confirmée", `Votre adresse est confirmée. Vous recevrez les évolutions de l'offre ${offer.name}.`);
}