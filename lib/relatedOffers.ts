import type { Offer } from "@/data/offers";

export function getRelatedOffers(offer: Offer, all: Offer[], limit = 3) {
  const sameCategory = all.filter(
    (candidate) => candidate.slug !== offer.slug && candidate.category === offer.category,
  );
  const sameGroup = all.filter(
    (candidate) =>
      candidate.slug !== offer.slug &&
      candidate.categoryGroup === offer.categoryGroup &&
      candidate.category !== offer.category,
  );

  return [...sameCategory, ...sameGroup].slice(0, limit);
}
