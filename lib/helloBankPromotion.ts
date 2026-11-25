import campaign from "@/data/hello-bank-promotion.json";

/**
 * Les informations variables de Hello bank! (lien de parrainage, montant du
 * reversement, fin de la promotion) vivent dans `data/hello-bank-promotion.json`.
 * Ce module est le seul endroit qui les interprète : changer une valeur dans le
 * JSON suffit, sans toucher au contenu public ni au design de la fiche.
 *
 * `promotionEnd` est une borne exclusive exprimée à l'heure de Paris : la
 * promotion reste active jusqu'à la veille 23 h 59 incluses.
 */
const TIMEZONE = campaign.parrainioReward.timezone;
const PROMOTION_END = Date.parse(campaign.parrainioReward.promotionEnd);

const euro = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function parseAmount(value: string): number {
  const amount = Number(value.replace(/[^\d,.-]/g, "").replace(",", "."));
  return Number.isFinite(amount) ? amount : 0;
}

function formatAmount(value: number): string {
  return `${euro.format(value)} €`;
}

function lastPromotionDay(): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIMEZONE,
  }).format(new Date(PROMOTION_END - 1));
}

export function selectHelloBankParrainioReward(now: Date | number = Date.now()): string {
  const timestamp = typeof now === "number" ? now : now.getTime();
  return timestamp < PROMOTION_END
    ? campaign.parrainioReward.promotion
    : campaign.parrainioReward.regular;
}

export function applyHelloBankReward<T extends { slug: string; parrainioReward: string | null }>(
  offers: T[],
  now: Date | number = Date.now(),
): T[] {
  const reward = selectHelloBankParrainioReward(now);
  return offers.map((offer) =>
    offer.slug === "hello-bank" ? { ...offer, parrainioReward: reward } : offer,
  );
}

/**
 * État public de la campagne, sans aucune donnée de gestion interne : le
 * visiteur ne voit que le montant en cours et, s'il est actif, le total
 * conditionnel des avantages. Aucune date de campagne expirée n'est exposée.
 */
export function getHelloBankPromotion(now: Date | number = Date.now()) {
  const timestamp = typeof now === "number" ? now : now.getTime();
  const parrainioReward = selectHelloBankParrainioReward(timestamp);
  const promotionActive = timestamp < PROMOTION_END;
  const reward = parseAmount(parrainioReward);
  const { helloPrime, helloOne, helloStartPlusVoucher } = campaign.partnerOffers;

  return {
    parrainioReward,
    promotionActive,
    primeTotal: formatAmount(helloPrime + reward + helloStartPlusVoucher),
    oneTotal: formatAmount(helloOne + reward + helloStartPlusVoucher),
    promoEndLabel: lastPromotionDay(),
    referralLink: campaign.referralLink,
  };
}
