import { readFileSync } from "node:fs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { offers, type Offer } from "@/data/offers";
import { getManagedOffers } from "@/data/managedOffers";
import {
  ADMIN_KV_KEYS,
  ensureAdminKvSeeded,
  getAdminBoostedCampaignConfigCached,
  isAdminKvConfigured,
  readAdminKvJson,
  writeAdminKvJson,
} from "@/lib/adminKv";

export const BOOSTED_CAMPAIGN_PATH = "/offres-boostees";

/**
 * Nombre d'offres mises en avant par la campagne (« les cinq offres »).
 * La SÉLECTION est administrable (data/boostedCampaign.ts ← admin
 * « Offres boostées ») : plus aucune liste de slugs n'est figée ici, sinon
 * l'admin n'aurait aucun effet sur le bandeau de l'accueil.
 */
export const BOOSTED_CAMPAIGN_OFFER_COUNT = 5;

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

export async function getBoostedCampaignConfig(): Promise<BoostedCampaignConfig> {
  const stored = await getAdminBoostedCampaignConfigCached();
  const parsed = (stored ?? JSON.parse(readFileSync(configPath, "utf8"))) as BoostedCampaignConfig;
  return validateBoostedCampaignConfig(parsed);
}

/**
 * Releve les reversements « habituels » (hors campagne) des offres demandées,
 * depuis la même source que les fiches (overrides KV, repli JSON Git).
 * Sert d'instantané pour restaurer les montants à la désactivation.
 */
async function getRegularRewardsFromOverrides(slugs: readonly string[]): Promise<Record<string, RegularOfferRewards>> {
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
  return Object.fromEntries(slugs.map((slug) => {
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
    parsed.offerSlugs.length !== BOOSTED_CAMPAIGN_OFFER_COUNT ||
    uniqueSlugs.size !== parsed.offerSlugs.length
  ) {
    throw new Error(`La campagne doit contenir exactement ${BOOSTED_CAMPAIGN_OFFER_COUNT} offres, sans doublon.`);
  }

  // La sélection est libre : seules l'existence de l'offre et la présence des
  // montants à afficher sont vérifiées. Les montants ne sont plus figés ici —
  // ils sont saisis dans l'admin et repris tels quels par l'accueil.
  const knownSlugs = new Set(offers.map((offer) => offer.slug));
  const unknown = parsed.offerSlugs.filter((slug) => !knownSlugs.has(slug));
  if (unknown.length > 0) {
    throw new Error(`Offre inconnue dans la campagne : ${unknown.join(", ")}.`);
  }
  for (const slug of parsed.offerSlugs) {
    const boost = parsed.offers[slug];
    if (!boost || typeof boost.parrainioReward !== "string" || !boost.parrainioReward.trim()) {
      throw new Error(`Reversement Parrainio manquant pour l'offre « ${slug} ».`);
    }
    if (boost.partnerReward !== undefined && (typeof boost.partnerReward !== "string" || !boost.partnerReward.trim())) {
      throw new Error(`Prime partenaire invalide pour l'offre « ${slug} ».`);
    }
  }
  if (
    parsed.regularRewards !== undefined &&
    Object.values(parsed.regularRewards).some(
      (regular) =>
        !regular ||
        (regular.parrainioReward !== null && typeof regular.parrainioReward !== "string") ||
        typeof regular.partnerReward !== "string",
    )
  ) {
    throw new Error("Instantané des reversements habituels invalide.");
  }

  // Normalisation : seules les offres sélectionnées sont conservées, dans
  // l'ordre choisi. C'est cet ordre que suit le bandeau de l'accueil.
  return {
    ...parsed,
    offers: Object.fromEntries(
      parsed.offerSlugs.map((slug) => [slug, parsed.offers[slug]]),
    ),
  };
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

/**
 * Sélection effective des cinq offres (lecture de rendu). Renvoie null si la
 * campagne est absente ou invalide — l'appelant retombe alors sur la
 * configuration historique. Couvre KV et repli JSON local (sans KV).
 */
export async function getBoostedCampaignSelection(): Promise<string[] | null> {
  try {
    const config = await getBoostedCampaignConfig();
    return config.offerSlugs.length === BOOSTED_CAMPAIGN_OFFER_COUNT
      ? config.offerSlugs
      : null;
  } catch {
    return null;
  }
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

/**
 * Sélection des cinq offres mises en avant : ordre, ajout, retrait,
 * remplacement, et montants affichés. Cœur réutilisable (sans contrôle
 * d'accès) appelé par l'action admin.
 */
export type BoostedSelectionInput = {
  slugs: string[];
  rewards?: Record<string, { parrainioReward?: string; partnerReward?: string }>;
};

export async function saveBoostedSelection(input: BoostedSelectionInput): Promise<BoostedCampaignConfig> {
  const slugs = (input.slugs ?? []).map((slug) => String(slug).trim());
  if (slugs.length !== BOOSTED_CAMPAIGN_OFFER_COUNT) {
    throw new Error(`Vous devez sélectionner exactement ${BOOSTED_CAMPAIGN_OFFER_COUNT} offres.`);
  }
  if (new Set(slugs).size !== slugs.length) {
    throw new Error("La sélection contient deux fois la même offre.");
  }

  const managedOffers = await getManagedOffers();
  const bySlug = new Map(managedOffers.map((offer) => [offer.slug, offer]));
  const unknown = slugs.filter((slug) => !bySlug.has(slug));
  if (unknown.length > 0) {
    throw new Error(`Certaines offres sélectionnées n'existent pas : ${unknown.join(", ")}.`);
  }

  const current = await getBoostedCampaignConfig();
  const offersBySlug: Record<string, BoostedCampaignOffer> = {};
  for (const slug of slugs) {
    const managed = bySlug.get(slug)!;
    const inputReward = input.rewards?.[slug];
    const existing = current.offers[slug];
    const parrainioReward = (
      inputReward?.parrainioReward ??
      existing?.parrainioReward ??
      managed.parrainioReward ??
      ""
    ).trim();
    const partnerReward = (
      inputReward?.partnerReward ??
      existing?.partnerReward ??
      managed.partnerReward ??
      ""
    ).trim();
    if (!parrainioReward) {
      throw new Error(`Renseignez le reversement Parrainio de « ${managed.name} ».`);
    }
    offersBySlug[slug] = partnerReward
      ? { parrainioReward, partnerReward }
      : { parrainioReward };
  }

  const next: BoostedCampaignConfig = { ...current, offerSlugs: slugs, offers: offersBySlug };
  const persisted = await saveBoostedCampaignConfig(next);
  if (!persisted) {
    throw new Error(
      "Stockage persistant indisponible : la sélection n'a pas pu être enregistrée durablement.",
    );
  }
  return next;
}

/**
 * Aligne le montant boosté d'une offre sur celui enregistré dans sa fiche.
 * Sans cela, une valeur saisie dans l'admin des offres resterait masquée par
 * l'ancien montant de campagne (cas du reversement SoBank figé).
 */
export async function syncBoostedOfferRewards(
  slug: string,
  rewards: { parrainioReward?: string | null; partnerReward?: string },
): Promise<boolean> {
  const parrainioReward = rewards.parrainioReward?.trim();
  if (!parrainioReward) return false;
  const campaign = await getBoostedCampaignConfig();
  if (!campaign.offerSlugs.includes(slug)) return false;
  const partnerReward = rewards.partnerReward?.trim();
  return saveBoostedCampaignConfig({
    ...campaign,
    offers: {
      ...campaign.offers,
      [slug]: {
        ...(campaign.offers[slug] ?? {}),
        parrainioReward,
        ...(partnerReward ? { partnerReward } : {}),
      },
    },
  });
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
    validated.regularRewards = await getRegularRewardsFromOverrides(validated.offerSlugs);
  } else if (validated.active) {
    // Campagne déjà active : on complète l'instantané pour les offres
    // nouvellement sélectionnées, sans jamais réécrire celui des autres —
    // la désactivation restaure les montants d'avant campagne.
    const missing = validated.offerSlugs.filter((slug) => !previous.regularRewards?.[slug]);
    validated.regularRewards = {
      ...(previous.regularRewards ?? {}),
      ...(missing.length > 0 ? await getRegularRewardsFromOverrides(missing) : {}),
    };
  } else {
    // Keep the original snapshot on deactivation. The base override record is
    // never rewritten by the campaign, so turning it off exposes the exact
    // values that were present before activation.
    validated.regularRewards = previous.regularRewards;
  }
  const persisted = await writeAdminKvJson(ADMIN_KV_KEYS.boostedCampaign, validated);
  if (persisted) return true;
  if (process.env.VERCEL_ENV) return false;
  mkdirSync(join(process.cwd(), "data"), { recursive: true });
  writeFileSync(configPath, `${JSON.stringify(validated, null, 2)}\n`, "utf8");
  return true;
}
