import type { MetadataRoute } from "next";
import { getManagedOffers } from "@/data/managedOffers";
import { CATEGORY_HUBS } from "@/lib/categoryHubs";
import {
  offerSeoProfiles,
  type OfferSeoProfile,
} from "@/data/offer-seo";
import { lot02Profiles } from "@/data/offer-seo-batch2";
import { lot05Profiles } from "@/data/offer-seo-batch3";
import { lot06Profiles } from "@/data/offer-seo-batch4";
import { lot07Profiles } from "@/data/offer-seo-batch5";
import { lot08Profiles } from "@/data/offer-seo-batch6";
import { lot09Profiles } from "@/data/offer-seo-batch7";
import { lot10Profiles } from "@/data/offer-seo-batch8";
import { lot11Profiles } from "@/data/offer-seo-batch9";
import { lot12Profiles } from "@/data/offer-seo-batch10";
import { lot13Profiles } from "@/data/offer-seo-batch11";
import { lot14Profiles } from "@/data/offer-seo-batch12";
import { lot15Profiles } from "@/data/offer-seo-batch13";
import { SITE_URL } from "@/lib/siteUrl";

function resolveOfferSeoProfile(slug: string): OfferSeoProfile | undefined {
  return (
    lot15Profiles[slug] ??
    lot14Profiles[slug] ??
    lot13Profiles[slug] ??
    lot12Profiles[slug] ??
    lot11Profiles[slug] ??
    lot10Profiles[slug] ??
    lot09Profiles[slug] ??
    lot08Profiles[slug] ??
    lot07Profiles[slug] ??
    lot06Profiles[slug] ??
    lot05Profiles[slug] ??
    lot02Profiles[slug] ??
    offerSeoProfiles[slug]
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/offres`, changeFrequency: "daily", priority: 0.9 },
    ...CATEGORY_HUBS.map((hub) => ({
      url: `${SITE_URL}/categories/${hub.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/comment-ca-marche`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/nos-avantages`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/classement-primes-parrainage`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/comparatif/parrainage-bancaire`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/mentions-legales`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/confidentialite`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/cgu`, changeFrequency: "monthly", priority: 0.2 },
  ];

  const offers = getManagedOffers();

  const offerEntries: MetadataRoute.Sitemap = offers.map((offer) => {
    const profile = resolveOfferSeoProfile(offer.slug);
    const lastModifiedSource =
      offer.lastUpdated ?? profile?.researchedAt ?? offer.publicationDate;
    let lastModified: Date | undefined;
    if (lastModifiedSource) {
      const parsed = new Date(lastModifiedSource);
      if (!Number.isNaN(parsed.getTime())) lastModified = parsed;
    }
    return {
      url: `${SITE_URL}/offres/${offer.slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  return [...staticEntries, ...offerEntries];
}
