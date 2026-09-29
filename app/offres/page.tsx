import type { Metadata } from "next";
import { getManagedOffers } from "@/data/managedOffers";
import { OG_IMAGE } from "@/lib/ogImage";
import { CATEGORY_HUBS } from "@/lib/categoryHubs";
import PublicHeader from "@/components/PublicHeader";
import OffersCatalog from "./OffersCatalog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Offres de parrainage : primes et bons plans | Parrainio",
  description:
    "Découvrez les meilleures offres de parrainage, comparez les primes, les conditions et le reversement Parrainio avant de vous lancer.",
  alternates: { canonical: "https://www.parrainio.fr/offres" },
  openGraph: { url: "/offres", type: "website", siteName: "Parrainio", locale: "fr_FR", images: [OG_IMAGE] },
};

export default async function OffresPage() {
  const offers = await getManagedOffers();
  const hubSlugByCategory = Object.fromEntries(
    CATEGORY_HUBS.map((hub) => [hub.group, hub.slug] as const)
  );

  return (
    <>
      <OffersCatalog
        offers={offers}
        hubSlugByCategory={hubSlugByCategory}
        header={<PublicHeader active="offers" />}
      />
    </>
  );
}
