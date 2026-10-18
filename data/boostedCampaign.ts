import { readFileSync } from "node:fs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { offers, type Offer } from "@/data/offers";
import {
  ADMIN_KV_KEYS,
  ensureAdminKvSeeded,
  getAdminBoostedCampaignConfigCached,
  isAdminKvConfigured,
  readAdminKvJson,
  writeAdminKvJson,
} from "@/lib/adminKv";

export const BOOSTED_CAMPAIGN_PATH = "/offres-boostees";
export const BOOSTED_CAMPAIGN_SLUGS = [
  "boursobank",
  "kraken",
  "n26",
  "etoro",
  "assurancevie-com",
] as const;

export type BoostedCampaignOffer = {
  parrainioReward: string;
  partnerReward?: string;
};

export type RegularOfferRewards = {
  parrainioReward: string | null;
  partnerReward: string;
};

export type BoostedCampaignConfig = {
  active: boolean;
  startAt: string;
  endAt: string | null;
  title: string;
  headline: string;
  durationLabel: string;
  offerSlugs: string[];
  offers: Record<string, BoostedCampaignOffer>;
  /** Original partner and Parrainio rewards captured from the source store on activation. */
  regularRewards?: Record<string, RegularOfferRewards>;
};

const configPath = join(process.cwd(), "data", "boosted-campaign.json");

const FIXED_CAMPAIGN_OFFERS: Record<string, BoostedCampaignOffer> = {
  boursobank: { parrainioReward: "40 €", partnerReward: "Jusqu'à 160 €" },
  kraken: { parrainioReward: "15 €", partnerReward: "30 € en BTC" },
  n26: { parrainioReward: "12,50 €" },
  etoro: { parrainioReward: "42 €" },
  "assurancevie-com": { parrainioReward: "50 €" },
};

export async function getBoostedCampaignConfig(): Promise<BoostedCampaignConfig> {
  const stored = await getAdminBoostedCampaignConfigCached();
  const parsed = (stored ?? JSON.parse(readFileSync(configPath, "utf8"))) as BoostedCampaignConfig;
  return validateBoostedCampaignConfig(parsed);
}

/** Reads the raw persistent overrides before merging the campaign, so production KV values are preserved. */
async function getRegularRewardsFromOverrides(): Promise<Record<string, RegularOfferRewards>> {
  let overrides: Record<string, { parrainioReward?: string | null; partnerReward?: string }>;
  if (isAdminKvConfigured()) {
    // Seeding is restricted to the authenticated, dynamic admin action. Its
    // EXISTS check preserves an already-customized production KV key.
    if (!(await ensureAdminKvSeeded())) {
      throw new Error("Impossible de vérifier les reversements habituels du KV de production : campagne non activée.");
    }
    const stored = await readAdminKvJson<Record<string, { parrainioReward?: string | null; partnerReward?: string }>>(
      ADMIN_KV_KEYS.offerOverrides,
    );
    if (!stored || typeof stored !== "object") {
      throw new Error("Impossible de lire les reversements habituels du KV de production : campagne non activée.");
    }
    overrides = stored;
  } else {
    overrides = JSON.parse(readFileSync(join(process.cwd(), "data", "offer-overrides.json"), "utf8")) as Record<string, { parrainioReward?: string | null; partnerReward?: string }>;
  }
  const seeds = new Map(offers.map((offer) => [offer.slug, offer]));
  return Object.fromEntries(BOOSTED_CAMPAIGN_SLUGS.map((slug) => {
    const seed = seeds.get(slug);
    if (!seed) throw new Error(`Offre introuvable : ${slug}.`);
    const override = overrides[slug] ?? {};
    return [slug, {
      parrainioReward: Object.prototype.hasOwnProperty.call(override, "parrainioReward")
        ? override.parrainioReward ?? null
        : seed.parrainioReward,
      partnerReward: override.partnerReward ?? seed.partnerReward,
    }];
  }));
}

function validateBoostedCampaignConfig(parsed: BoostedCampaignConfig): BoostedCampaignConfig {
  if (
    !parsed ||
    typeof parsed.active !== "boolean" ||
    !Array.isArray(parsed.offerSlugs) ||
    !parsed.offers ||
    typeof parsed.title !== "string" ||
    typeof parsed.headline !== "string" ||
    typeof parsed.durationLabel !== "string" ||
    !Number.isFinite(Date.parse(parsed.startAt)) ||
    (parsed.endAt !== null && !Number.isFinite(Date.parse(parsed.endAt)))
  ) {
    throw new Error("Configuration de campagne invalide.");
  }
  const uniqueSlugs = new Set(parsed.offerSlugs);
  if (
    uniqueSlugs.size !== parsed.offerSlugs.length ||
    parsed.offerSlugs.some((slug) => !(BOOSTED_CAMPAIGN_SLUGS as readonly string[]).includes(slug)) ||
    BOOSTED_CAMPAIGN_SLUGS.some((slug) => {
      const configured = parsed.offers[slug];
      const expected = FIXED_CAMPAIGN_OFFERS[slug];
      return !uniqueSlugs.has(slug) ||
        !configured ||
        configured.parrainioReward !== expected.parrainioReward ||
        configured.partnerReward !== expected.partnerReward;
    }) ||
    (parsed.regularRewards !== undefined && BOOSTED_CAMPAIGN_SLUGS.some((slug) => {
      const regular = parsed.regularRewards?.[slug];
      return !regular || (regular.parrainioReward !== null && typeof regular.parrainioReward !== "string") || typeof regular.partnerReward !== "string";
    }))
  ) {
    throw new Error("La campagne doit contenir les cinq offres boostées configurées.");
  }
  return parsed;
}

export function isBoostedCampaignActive(
  config: BoostedCampaignConfig,
  now = Date.now(),
): boolean {
  const start = Date.parse(config.startAt);
  const end = config.endAt ? Date.parse(config.endAt) : null;
  return config.active && now >= start && (end === null || now < end);
}

export async function getActiveBoostedCampaign(now = Date.now()) {
  const config = await getBoostedCampaignConfig();
  // Never publish a boost until the habitual rewards have been snapshotted
  // from the current overrides store (including an existing production KV).
  if (!config.regularRewards) return null;
  return isBoostedCampaignActive(config, now) ? config : null;
}

export async function isOfferBoosted(slug: string, now = Date.now()) {
  const campaign = await getActiveBoostedCampaign(now);
  return Boolean(campaign?.offerSlugs.includes(slug));
}

export function applyBoostedCampaign<T extends Offer>(
  offers: T[],
  campaign: BoostedCampaignConfig | null,
): T[] {
  return offers.map((offer) => applyCampaignToOffer(offer, campaign));
}

export function applyCampaignToOffer<T extends Offer>(
  offer: T,
  campaign: BoostedCampaignConfig | null,
): T {
  const boost = campaign?.offers[offer.slug];
  if (!boost || !campaign?.offerSlugs.includes(offer.slug)) return offer;
  return {
    ...offer,
    isCampaignBoosted: true,
    parrainioReward: boost.parrainioReward,
    ...(boost.partnerReward ? {
      partnerReward: boost.partnerReward,
      bonus: boost.partnerReward,
      partnerBonusLabel: boost.partnerReward,
    } : {}),
  };
}

export async function applyBoostedCampaignToOffer<T extends Offer>(
  offer: T,
  now = Date.now(),
): Promise<T> {
  return applyBoostedCampaign([offer], await getActiveBoostedCampaign(now))[0];
}

export async function saveBoostedCampaignConfig(config: BoostedCampaignConfig): Promise<boolean> {
  const validated = validateBoostedCampaignConfig(config);
  if (validated.headline !== "50 % de notre commission reversée" || validated.durationLabel !== "Durée limitée") {
    throw new Error("La mention publique de la campagne doit rester « 50 % de notre commission reversée » et « Durée limitée ».");
  }
  if (validated.endAt && Date.parse(validated.endAt) <= Date.parse(validated.startAt)) {
    throw new Error("La fin de campagne doit être postérieure à son début.");
  }
  const previous = await getBoostedCampaignConfig();
  const wasActive = isBoostedCampaignActive(previous);
  if (validated.active && !wasActive) {
    validated.regularRewards = await getRegularRewardsFromOverrides();
  } else {
    // Keep the original snapshot on edits and deactivation. The base override
    // record is never rewritten by the campaign, so turning it off exposes the
    // exact values that were present before activation.
    validated.regularRewards = previous.regularRewards;
  }
  const persisted = await writeAdminKvJson(ADMIN_KV_KEYS.boostedCampaign, validated);
  if (persisted) return true;
  if (process.env.VERCEL_ENV) return false;
  mkdirSync(join(process.cwd(), "data"), { recursive: true });
  writeFileSync(configPath, `${JSON.stringify(validated, null, 2)}\n`, "utf8");
  return true;
}
