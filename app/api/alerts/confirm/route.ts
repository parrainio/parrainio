import { NextResponse } from "next/server";
import { hashEmail, verifyAlertToken } from "@/lib/alertTokens";
import { confirmSubscription } from "@/lib/alertSubscriptions";
import { getManagedOffer } from "@/data/managedOffers";

/**
 * Confirmation du double opt-in (lien reçu par e-mail).
 * Token HMAC : aucun identifiant interne ni adresse en clair exposés.
 * Réponse HTML minimale, noindex, avec lien vers l'offre concernée.
 */

function page(params: { title: string; body: string; offerSlug?: string }) {
  const offerLink = params.offerSlug
    ? `<p><a href="/offres/${params.offerSlug}">Retour à l'offre</a></p>`
    : `<p><a href="/">Retour à l'accueil</a></p>`;
  return new NextResponse(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${params.title}</title><style>body{font-family:Arial,sans-serif;background:#f8f7f1;color:#173d35;display:grid;place-items:center;min-height:100vh;margin:0}main{max-width:420px;padding:32px;background:#fffdfa;border-radius:16px;text-align:center}h1{color:#075846;font-size:1.1rem}a{color:#ef873e}</style></head><body><main><h1>${params.title}</h1><p>${params.body}</p>${offerLink}</main></body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex, nofollow" } },
  );
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("t") ?? "";
  const payload = verifyAlertToken(token);
  if (!payload) {
    return page({ title: "Lien invalide", body: "Ce lien de confirmation est invalide ou incomplet. Veuillez recréer votre alerte depuis la page de l'offre." });
  }

  const offer = getManagedOffer(payload.s);
  if (!offer) {
    return page({ title: "Offre introuvable", body: "L'offre associée à cette alerte n'existe plus." });
  }

  const result = await confirmSubscription(payload.e, payload.s);
  if (!result.ok) {
    return page({ title: "Service indisponible", body: "Le service d'alertes est momentanément indisponible. Veuillez réessayer plus tard." });
  }
  if (!result.value) {
    return page({ title: "Alerte introuvable", body: "Aucune demande d'alerte à confirmer pour ce lien. Vous pouvez la recréer depuis la page de l'offre.", offerSlug: payload.s });
  }

  return page({
    title: "✓ Votre alerte est activée",
    body: `Vous recevrez un e-mail si l'offre ${offer.name} évolue de manière significative.`,
    offerSlug: offer.slug,
  });
}
