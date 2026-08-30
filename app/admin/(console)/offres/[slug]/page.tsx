import { notFound } from "next/navigation";
import { getManagedOffer } from "@/data/managedOffers";
import OfferEditor from "./OfferEditor";

export const dynamic = "force-dynamic";

export default async function AdminOfferPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offer = getManagedOffer(slug);
  if (!offer) notFound();

  return (
    <OfferEditor
      offer={{
        slug: offer.slug,
        name: offer.name,
        category: offer.category,
        description: offer.description,
        partnerReward: offer.partnerReward,
        parrainioReward: offer.parrainioReward ?? "",
        referralCode: offer.referralCode ?? "",
        referralLink: offer.referralLink ?? "",
        officialWebsiteUrl: offer.officialWebsiteUrl ?? "",
        conditions: offer.conditions,
        steps: offer.steps,
        publicationDate: offer.publicationDate ?? "",
        sourceUrl: offer.sourceUrl,
        logo: offer.logo,
        logoVerified: offer.logoVerified,
        color: offer.color,
        logoLetter: offer.logoLetter,
        manualReview: offer.manualReview,
      }}
    />
  );
}
