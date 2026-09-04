import { Suspense } from "react";
import type { Metadata } from "next";
import { getManagedOffers } from "@/data/managedOffers";
import OffersCatalog from "./OffersCatalog";
import CategoryOffers from "./CategoryOffers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Offres de parrainage : primes et bons plans | Parrainio",
  description:
    "Découvrez les meilleures offres de parrainage, comparez les primes, les conditions et le reversement Parrainio avant de vous lancer.",
  alternates: { canonical: "https://www.parrainio.fr/offres" },
  openGraph: { url: "/offres", type: "website", siteName: "Parrainio", locale: "fr_FR" },
};

export default function OffresPage() {
  const offers = getManagedOffers();

  return (
    <Suspense>
      <OffersCatalog offers={offers} />
    </Suspense>
  );
}
