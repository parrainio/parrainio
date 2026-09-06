import { NextResponse } from "next/server";
import { verifyAlertToken } from "@/lib/alertTokens";
import { performUnsubscribe } from "@/lib/alertSubscriptions";
import { getManagedOffer } from "@/data/managedOffers";

/**
 * Désabonnement (lien présent dans chaque e-mail d'alerte et de confirmation).
 * Token HMAC : identifie la souscription sans exposer l'adresse e-mail ni
 * d'identifiant interne. Réponse HTML minimale, noindex.
 */

function page(params: { title: string; body: string }) {
  return new NextResponse(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${params.title}</title><style>body{font-family:Arial,sans-serif;background:#f8f7f1;color:#173d35;display:grid;place-items:center;min-height:100vh;margin:0}main{max-width:420px;padding:32px;background:#fffdfa;border-radius:16px;text-align:center}h1{color:#075846;font-size:1.1rem}a{color:#ef873e}</style></head><body><main><h1>${params.title}</h1><p>${params.body}</p><p><a href="/">Retour à l'accueil</a></p></main></body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex, nofollow" } },
  );
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("t") ?? "";
  const payload = verifyAlertToken(token);
  if (!payload) {
    return page({ title: "Lien invalide", body: "Ce lien de désabonnement est invalide ou incomplet." });
  }

  const offer = getManagedOffer(payload.s);
  if (!offer) {
    return page({ title: "Offre introuvable", body: "L'offre associée à cette alerte n'existe plus." });
  }

  const result = await performUnsubscribe(payload.e, payload.s);
  if (!result.ok) {
    return page({ title: "Service indisponible", body: "Le service d'alertes est momentanément indisponible. Veuillez réessayer plus tard." });
  }
  if (!result.value) {
    return page({ title: "Alerte introuvable", body: "Aucune alerte active n'a été trouvée pour ce lien. Si vous recevez encore des e-mails, contactez parrainage@parrainio.fr." });
  }

  return page({
    title: "✓ Désabonnement confirmé",
    body: `Vous ne recevrez plus d'alerte pour l'offre ${offer.name}.`,
  });
}
