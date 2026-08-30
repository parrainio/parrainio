import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { offers, type Offer, type OfferCondition, type OfferStep } from "./offers";
import {
  getOfferCompleteness,
  type OfferCompleteness,
  type OfferStatusKey,
} from "@/lib/offerCompleteness";

export type OfferOverride = {
  name?: string;
  category?: string;
  description?: string;
  partnerReward?: string;
  parrainioReward?: string | null;
  referralCode?: string | null;
  referralLink?: string | null;
  officialWebsiteUrl?: string | null;
  conditions?: OfferCondition[];
  steps?: OfferStep[];
  logo?: string | null;
  logoVerified?: boolean;
  sourceUrl?: string;
  publicationDate?: string | null;
  lastUpdated?: string;
  lastVerifiedAt?: string;
  researchSource?: string;
  manualReview?: boolean;
};

export type OfferOverrides = Record<string, OfferOverride>;

export type ManagedOffer = Offer & {
  lastUpdated: string | null;
  lastVerifiedAt: string | null;
  researchSource: string | null;
  manualReview: boolean;
  completeness: OfferCompleteness;
};

export type OfferExportRecord = {
  companyName: string;
  slug: string;
  category: string;
  partnerReward: string;
  parrainioReward: string | null;
  referralCode: string | null;
  referralLink: string | null;
  officialWebsiteUrl: string | null;
  conditions: OfferCondition[];
  steps: OfferStep[];
  description: string;
  logo: string | null;
  sourceUrl: string;
  publicationDate: string | null;
  lastUpdated: string | null;
};

const dataDir = join(process.cwd(), "data");
const overridePath = join(dataDir, "offer-overrides.json");
const logoIndexPath = join(dataDir, "logo-index.json");
const researchMetaPath = join(dataDir, "offer-research-meta.json");

function readJson<T>(path: string, fallback: T): T {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function readOverrides(): OfferOverrides {
  return readJson<OfferOverrides>(overridePath, {});
}

function readLogoIndex(): OfferOverrides {
  return readJson<OfferOverrides>(logoIndexPath, {});
}

function readResearchMeta(): Record<string, { publicationDate?: string }> {
  return readJson(researchMetaPath, {});
}

function keepExisting<T>(incoming: T | undefined, existing: T): T {
  if (incoming === undefined) return existing;
  if (typeof incoming === "string" && incoming.trim() === "" && existing) {
    return existing;
  }
  return incoming;
}

function pickProtectedString(
  seedValue: string | null,
  autoValue: string | null | undefined,
  overrideValue: string | null | undefined,
) {
  if (overrideValue !== undefined) {
    if (typeof overrideValue === "string" && overrideValue.trim() === "" && seedValue) {
      return { value: seedValue, conflict: false };
    }
    return { value: overrideValue, conflict: false };
  }

  if (seedValue && autoValue && autoValue !== seedValue) {
    return { value: seedValue, conflict: true };
  }

  return { value: seedValue || autoValue || null, conflict: false };
}

export function mergeOfferRecord(
  seed: Offer,
  auto: OfferOverride = {},
  override: OfferOverride = {},
): ManagedOffer {
  const code = pickProtectedString(seed.referralCode, auto.referralCode, override.referralCode);
  const link = pickProtectedString(seed.referralLink, auto.referralLink, override.referralLink);

  const merged: Offer = {
    ...seed,
    name: override.name ?? seed.name,
    category: override.category ?? seed.category,
    description: override.description ?? seed.description,
    partnerReward: override.partnerReward ?? seed.partnerReward,
    bonus: override.partnerReward ?? seed.bonus,
    partnerBonusLabel: override.partnerReward ?? seed.partnerBonusLabel,
    parrainioReward: keepExisting(override.parrainioReward, seed.parrainioReward),
    referralCode: code.value,
    referralLink: link.value,
    officialWebsiteUrl: override.officialWebsiteUrl ?? seed.officialWebsiteUrl,
    conditions: override.conditions ?? seed.conditions,
    steps: override.steps ?? seed.steps,
    logo: override.logo ?? auto.logo ?? seed.logo,
    logoVerified: override.logoVerified ?? auto.logoVerified ?? seed.logoVerified,
    sourceUrl: override.sourceUrl ?? seed.sourceUrl,
    publicationDate:
      override.publicationDate ??
      seed.publicationDate ??
      auto.publicationDate ??
      null,
  };

  const manualReview = Boolean(override.manualReview) || code.conflict || link.conflict;
  return {
    ...merged,
    lastUpdated: override.lastUpdated ?? null,
    lastVerifiedAt: override.lastVerifiedAt ?? null,
    researchSource: override.researchSource ?? null,
    manualReview,
    completeness: getOfferCompleteness(merged, manualReview),
  };
}

export function getManagedOffers(): ManagedOffer[] {
  const overrides = readOverrides();
  const logos = readLogoIndex();
  const research = readResearchMeta();

  return offers.map((offer) =>
    mergeOfferRecord(
      offer,
      {
        ...logos[offer.slug],
        publicationDate: research[offer.slug]?.publicationDate ?? logos[offer.slug]?.publicationDate,
      },
      overrides[offer.slug],
    ),
  );
}

export function getManagedOffer(slug: string) {
  return getManagedOffers().find((offer) => offer.slug === slug);
}

export function saveOfferOverride(slug: string, data: OfferOverride) {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  const overrides = readOverrides();
  const seed = offers.find((offer) => offer.slug === slug);
  const current = overrides[slug] ?? {};

  const next: OfferOverride = {
    ...current,
    ...data,
    lastUpdated: new Date().toISOString(),
  };

  if (seed) {
    if (next.referralCode === "" && seed.referralCode) next.referralCode = seed.referralCode;
    if (next.referralLink === "" && seed.referralLink) next.referralLink = seed.referralLink;
  }

  overrides[slug] = next;
  writeFileSync(overridePath, `${JSON.stringify(overrides, null, 2)}\n`, "utf8");
  return getManagedOffer(slug);
}

export function saveLogoIndex(index: OfferOverrides) {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  writeFileSync(logoIndexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
}

export function toExportRecord(offer: ManagedOffer): OfferExportRecord {
  return {
    companyName: offer.name,
    slug: offer.slug,
    category: offer.category,
    partnerReward: offer.partnerReward,
    parrainioReward: offer.parrainioReward,
    referralCode: offer.referralCode,
    referralLink: offer.referralLink,
    officialWebsiteUrl: offer.officialWebsiteUrl,
    conditions: offer.conditions,
    steps: offer.steps,
    description: offer.description,
    logo: offer.logo,
    sourceUrl: offer.sourceUrl,
    publicationDate: offer.publicationDate,
    lastUpdated: offer.lastUpdated,
  };
}

export function getDashboardStats(list: ManagedOffer[] = getManagedOffers()) {
  const counts = {
    total: list.length,
    complete: 0,
    partial: 0,
    incomplete: 0,
    review: 0,
    withCode: 0,
    withLink: 0,
    withBoth: 0,
    withNeither: 0,
    withConditions: 0,
    withLogo: 0,
  };

  for (const offer of list) {
    const { status, indicators } = offer.completeness;
    counts[status] += 1;
    if (indicators.hasCode) counts.withCode += 1;
    if (indicators.hasLink) counts.withLink += 1;
    if (indicators.hasCode && indicators.hasLink) counts.withBoth += 1;
    if (!indicators.hasCode && !indicators.hasLink) counts.withNeither += 1;
    if (indicators.hasConditions) counts.withConditions += 1;
    if (indicators.hasLogo) counts.withLogo += 1;
  }

  return counts;
}

export function statusLabel(status: OfferStatusKey) {
  switch (status) {
    case "complete":
      return "Complète";
    case "partial":
      return "Partielle";
    case "incomplete":
      return "À compléter";
    case "review":
      return "À vérifier";
  }
}

export { overridePath };
