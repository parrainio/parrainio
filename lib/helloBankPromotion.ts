// Paris est en UTC+1 (heure d'hiver) du 25/10/2026 à la fin de la
// promotion : 30/10/2026 00 h 00 Europe/Paris = 29/10/2026 23 h 00 UTC.
// Le reversement reste donc à 60 € jusqu'au 29 octobre inclus et repasse à
// 5 € automatiquement à minuit, heure de Paris.
export const HELLO_BANK_PROMOTION_END = Date.parse("2026-10-30T00:00:00+01:00");
// Fin de la fenêtre de demande d'invitation : 29/10/2026 15 h Paris = +01:00
// (et non +02:00 : l'heure d'été est terminée depuis le 25/10/2026).
export const HELLO_BANK_REQUEST_DEADLINE = Date.parse("2026-10-29T15:00:00+01:00");

export function selectHelloBankParrainioReward(now: Date | number = Date.now()): string {
  const timestamp = typeof now === "number" ? now : now.getTime();
  return timestamp < HELLO_BANK_PROMOTION_END ? "60 €" : "5 €";
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

export function getHelloBankPromotion(now: Date | number = Date.now()) {
  const timestamp = typeof now === "number" ? now : now.getTime();
  const parrainioReward = selectHelloBankParrainioReward(timestamp);
  const promotionActive = parrainioReward === "60 €";
  const requestWindowOpen = timestamp < HELLO_BANK_REQUEST_DEADLINE;
  return {
    parrainioReward,
    promotionActive,
    requestWindowOpen,
    primeTotal: requestWindowOpen ? (promotionActive ? "390 €" : "335 €") : null,
    oneTotal: requestWindowOpen ? (promotionActive ? "340 €" : "285 €") : null,
    deadlinePassed: !requestWindowOpen,
  };
}
