import { getManagedOffers } from "@/data/managedOffers";
import type { OfferCategory } from "@/data/offers";
import { getFeaturedOfferSlugsServer } from "@/lib/featuredOffersServer";

/**
 * Offres d'un groupe de catégorie, dans l'ordre du catalogue,
 * avec les offres de la « sélection du moment » remontées en tête.
 * Aucun classement commercial n'est inventé : la mise en avant
 * réutilise la configuration existante du site.
 */
export function getCategoryHubOffers(group: OfferCategory) {
  const offers = getManagedOffers().filter(
    (offer) => offer.categoryGroup === group
  );
  const featuredSlugs = new Set(getFeaturedOfferSlugsServer());

  return [...offers].sort((a, b) => {
    const aFeatured = featuredSlugs.has(a.slug) ? 1 : 0;
    const bFeatured = featuredSlugs.has(b.slug) ? 1 : 0;
    if (aFeatured !== bFeatured) return bFeatured - aFeatured;
    return 0; // tri stable : l'ordre du catalogue est conservé
  });
}
