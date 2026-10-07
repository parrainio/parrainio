import type { Offer } from "@/data/offers";

/**
 * Extraction du premier montant en euros d'un libellé de récompense tel que
 * publié dans les données gérées (ex. « Jusqu'à 160€ » → 160). La conception
 * n'accepte qu'un montant par champ : on ne parse que la première occurrence,
 * sans réinterpréter les formats (« 50€ offerts », « 1 000 € », « 12,50 € »).
 * Retourne null si aucun montant : le rendu utilise alors les valeurs
 * textuelles de l'offre, sans montant synthétique dérivé.
 */
export function extractEurosAmount(reward: string | null | undefined): number | null {
  if (!reward?.trim()) return null;
  const match = /((?:\d{1,3}(?:\s|&nbsp;| )?)*\d+(?:[.,]\d+)?)/.exec(reward.trim());
  if (!match) return null;
  const cleaned = match[1].replace(/[\s]/g, "").replace(",", ".");
  return parseFloat(cleaned);
}

/**
 * Avantage potentiel affiché par la carte hero = avantage partenaire
 * PLUS reversement Parrainio (convention du design existant : les lignes
 * s'additionnent). null si montant partenaire absent OU si l'un des deux
 * en présence n'est pas exprimé en euros : dans ce cas, pas de total
 * synthétique affiché plutôt qu'un total trompeur.
 */
export function computePotentialAdvantage(
  partnerReward: string | null | undefined,
  parrainioReward: string | null | undefined,
): number | null {
  const partner = extractEurosAmount(partnerReward);
  if (partner === null) return null;
  const extra = parrainioReward?.trim();
  if (!extra) return partner;
  const extraAmount = extractEurosAmount(extra);
  if (extraAmount === null) return null;
  return partner + extraAmount;
}
