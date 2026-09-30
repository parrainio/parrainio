/**
 * Classification du mécanisme de parrainage d'une offre, à partir des données
 * runtime (même logique que le hub /codes-parrainage — chantier F2-E.2).
 *
 * Sert au maillage contextuel fiches → /codes-parrainage : l'ancre doit
 * correspondre au mécanisme réel. Une offre sans code ni invitation dédiée
 * ne reçoit pas de lien vers le hub.
 *
 * - CODE_PUBLIC : code générique/de marque documenté (audit F2-E.1) ;
 * - NUMERO_PARRAIN : numéro/identifiant utilisé pour le rattachement ;
 * - CODE_PARRAIN : code personnel d'un parrain ;
 * - LIEN_EMAIL : rattachement par lien d'invitation ou e-mail du parrain
 *   (jamais présenté comme un code — ex. bebe-boutik).
 */
const GENERIC_CODE_SLUGS = new Set([
  "swissborg",
  "sumeria",
  "naomi-1",
  "coinhouse",
  "crypto-com",
  "primeo-energie",
  "totalenergies",
  "raizers",
  "splint-invest",
  "winamax",
  "showroomprive",
  "i-run-fr",
]);

// Rattachement documenté par lien d'invitation ou e-mail du parrain
// (conditions officielles de l'offre) — jamais un code.
const EMAIL_MECHANISM_SLUGS = new Set(["bebe-boutik"]);

export type ReferralMechanism = "CODE_PUBLIC" | "CODE_PARRAIN" | "NUMERO_PARRAIN" | "LIEN_EMAIL";

export function classifyReferralMechanism(
  slug: string,
  referralCode: string | null | undefined,
): ReferralMechanism | null {
  if (EMAIL_MECHANISM_SLUGS.has(slug)) return "LIEN_EMAIL";
  const code = referralCode?.trim();
  if (!code) return null;
  if (/^\d{4,}$/.test(code)) return "NUMERO_PARRAIN";
  if (GENERIC_CODE_SLUGS.has(slug)) return "CODE_PUBLIC";
  return "CODE_PARRAIN";
}

/** Ancre contextuelle du lien vers /codes-parrainage, selon le mécanisme réel. */
const HUB_LINK_ANCHOR: Record<ReferralMechanism, string> = {
  CODE_PUBLIC: "Voir le code et les conditions",
  CODE_PARRAIN: "Voir les codes de parrainage",
  NUMERO_PARRAIN: "Comprendre le numéro d'invitation",
  LIEN_EMAIL: "Voir le mécanisme d'invitation",
};

export function getHubLinkAnchor(mechanism: ReferralMechanism): string {
  return HUB_LINK_ANCHOR[mechanism];
}
