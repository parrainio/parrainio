import { Suspense } from "react";
import type { Metadata } from "next";
import { getManagedOffers } from "@/data/managedOffers";
import OffersCatalog from "./OffersCatalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Offres de parrainage : primes et bons plans | Parrainio",
  description:
    "Découvrez les meilleures offres de parrainage, comparez les primes, les conditions et le reversement Parrainio avant de vous lancer.",
  alternates: { canonical: "/offres" },
};

export default function OffresPage() {
  const offers = getManagedOffers();

  return (
    <Suspense>
      <OffersCatalog offers={offers} />
    </Suspense>
  );
}
