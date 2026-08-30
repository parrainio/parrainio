import { getDashboardStats, getManagedOffers, statusLabel } from "@/data/managedOffers";
import OffersDashboard from "./OffersDashboard";

export const dynamic = "force-dynamic";

export default function AdminOffersPage() {
  const offers = getManagedOffers();
  const stats = getDashboardStats(offers);
  const categories = Array.from(new Set(offers.map((offer) => offer.category))).sort((a, b) =>
    a.localeCompare(b, "fr"),
  );

  return (
    <OffersDashboard
      categories={categories}
      stats={stats}
      offers={offers.map((offer) => ({
        slug: offer.slug,
        name: offer.name,
        category: offer.category,
        partnerReward: offer.partnerReward,
        parrainioReward: offer.parrainioReward,
        referralCode: offer.referralCode,
        referralLink: offer.referralLink,
        conditions: offer.conditions,
        lastUpdated: offer.lastUpdated,
        logo: offer.logo,
        logoVerified: offer.logoVerified,
        color: offer.color,
        logoLetter: offer.logoLetter,
        status: offer.completeness.status,
        statusLabel: statusLabel(offer.completeness.status),
        indicators: offer.completeness.indicators,
      }))}
    />
  );
}
