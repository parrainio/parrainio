import type { Offer } from "@/data/offers";
import { getSafeReferralUrl } from "@/lib/referralSafety";

export type OfferStatusKey = "complete" | "partial" | "incomplete" | "review";

export type OfferIndicators = {
  hasCode: boolean;
  hasLink: boolean;
  hasConditions: boolean;
  hasLogo: boolean;
  hasPartnerReward: boolean;
  hasParrainioReward: boolean;
};

export type OfferCompleteness = {
  status: OfferStatusKey;
  indicators: OfferIndicators;
};

export function hasMeaningfulConditions(conditions: string[]) {
  return conditions.some((condition) => {
    const value = condition.trim();
    return (
      value.length > 0 &&
      !value.startsWith("Vérifiez votre éligibilité") &&
      !value.startsWith("Les conditions et montants") &&
      !value.startsWith("Consultez les conditions")
    );
  });
}

export function getOfferIndicators(offer: Offer): OfferIndicators {
  return {
    hasCode: Boolean(offer.referralCode?.trim()),
    hasLink: Boolean(getSafeReferralUrl(offer.referralLink)),
    hasConditions: hasMeaningfulConditions(offer.conditions),
    hasLogo: Boolean(offer.logo),
    hasPartnerReward: Boolean(offer.partnerReward?.trim()),
    hasParrainioReward: Boolean(offer.parrainioReward?.trim()),
  };
}

export function getOfferCompleteness(
  offer: Offer,
  manualReview = false,
): OfferCompleteness {
  const indicators = getOfferIndicators(offer);
  const rewardsReady = indicators.hasPartnerReward && indicators.hasParrainioReward;
  const complete =
    (indicators.hasCode || indicators.hasLink) &&
    rewardsReady &&
    indicators.hasConditions &&
    indicators.hasLogo;

  let status: OfferStatusKey = "partial";
  if (manualReview) status = "review";
  else if (complete) status = "complete";
  else if (!indicators.hasCode && !indicators.hasLink) status = "incomplete";

  return { status, indicators };
}
