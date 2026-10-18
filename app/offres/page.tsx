import type { Metadata } from "next";
import { connection } from "next/server";
import { getManagedOffers } from "@/data/managedOffers";
import { applyBoostedCampaign, getActiveBoostedCampaign } from "@/data/boostedCampaign";
import { applyHelloBankReward } from "@/lib/helloBankPromotion";
import { OG_IMAGE } from "@/lib/ogImage";
import { CATEGORY_HUBS } from "@/lib/categoryHubs";
import PublicHeader from "@/components/PublicHeader";
import OffersCatalog from "./OffersCatalog";



export const metadata: Metadata = {
  title: "Offres de parrainage : primes et bons plans | Parrainio",
  description:
    "Découvrez les meilleures offres de parrainage, comparez les primes, les conditions et le reversement Parrainio avant de vous lancer.",
  alternates: { canonical: "https://www.parrainio.fr/offres" },
  openGraph: { url: "/offres", type: "website", siteName: "Parrainio", locale: "fr_FR", images: [OG_IMAGE] },
};

export default async function OffresPage() {
  await connection();
  const [managedOffers, campaign] = await Promise.all([getManagedOffers(), getActiveBoostedCampaign()]);
  const offers = applyHelloBankReward(applyBoostedCampaign(managedOffers, campaign));
  const hubSlugByCategory = Object.fromEntries(
    CATEGORY_HUBS.map((hub) => [hub.group, hub.slug] as const)
  );

  return (
    <>
      <OffersCatalog
        offers={offers}
        campaign={campaign}
        hubSlugByCategory={hubSlugByCategory}
        header={<PublicHeader active="offers" campaignActive={Boolean(campaign)} />}
      />
    </>
  );
}
