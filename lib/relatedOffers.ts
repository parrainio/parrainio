import type { Offer } from "@/data/offers";

/**
 * Hash déterministe (djb2) : répartit les offres associées de façon stable,
 * sans dépendre de l'ordre d'insertion du tableau des offres.
 */
function stableHash(value: string): number {
  let hash = 5381;
  for (let index = 0; index < value.length; index++) {
    hash = ((hash << 5) + hash + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Ordre de rotation propre à chaque couple (offre source, candidate) :
 * chaque page voit un ordre différent mais constant dans le temps.
 */
function byPairRotation(sourceSlug: string) {
  return (a: Offer, b: Offer) =>
    stableHash(`${sourceSlug}::${a.slug}`) - stableHash(`${sourceSlug}::${b.slug}`);
}

export function getRelatedOffers(offer: Offer, all: Offer[], limit = 3): Offer[] {
  const others = all.filter((candidate) => candidate.slug !== offer.slug);
  const sameCategory = others.filter((candidate) => candidate.category === offer.category);
  // Les grosses catégories rempliraient autrement les 3 slots à elles seules :
  // on leur en réserve 2 maximum pour laisser passer les offres du même groupe
  // et les catégories rares (maillage plus utile, meilleure distribution).
  const categorySize = sameCategory.length + 1;
  const sameCategoryCap = categorySize >= 6 ? 2 : limit;
  const sameGroup = others.filter(
    (candidate) =>
      candidate.categoryGroup === offer.categoryGroup && candidate.category !== offer.category,
  );
  const rest = others.filter(
    (candidate) =>
      candidate.categoryGroup !== offer.categoryGroup && candidate.category !== offer.category,
  );

  // Taille de chaque catégorie : les offres de catégories rares (voire uniques)
  // risquent sinon de ne jamais apparaître dans les blocs « offres associées ».
  const categorySizes = new Map<string, number>();
  for (const candidate of all) {
    categorySizes.set(candidate.category, (categorySizes.get(candidate.category) ?? 0) + 1);
  }

  const rotate = byPairRotation(offer.slug);
  // Pool élargi : priorité aux catégories peu représentées, puis rotation stable
  // par couple (source, candidate) pour éviter de toujours choisir les mêmes.
  const restByRarity = [...rest].sort(
    (a, b) =>
      (categorySizes.get(a.category) ?? 0) - (categorySizes.get(b.category) ?? 0) ||
      stableHash(`${offer.slug}::${a.slug}`) - stableHash(`${offer.slug}::${b.slug}`),
  );
  const picked: Offer[] = [];
  for (const [pool, poolLimit] of [
    [sameCategory, sameCategoryCap],
    [sameGroup, limit],
    [restByRarity, limit],
  ] as const) {
    for (const candidate of [...pool].sort(rotate).slice(0, poolLimit)) {
      if (picked.length >= limit) return picked;
      picked.push(candidate);
    }
  }
  return picked;
}
