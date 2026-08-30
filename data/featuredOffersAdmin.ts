import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dataDir = join(process.cwd(), "data");
const featuredConfigPath = join(dataDir, "featured-config.json");

export type FeaturedOffersConfig = {
  featuredOfferSlugs: string[];
};

const defaultFeaturedOffersConfig: FeaturedOffersConfig = {
  featuredOfferSlugs: [
    "boursobank",
    "linxea",
    "splint-invest",
    "revolut"
  ]
};

function readFeaturedConfig(): FeaturedOffersConfig {
  if (!existsSync(featuredConfigPath)) {
    return defaultFeaturedOffersConfig;
  }
  try {
    return JSON.parse(readFileSync(featuredConfigPath, "utf8")) as FeaturedOffersConfig;
  } catch {
    return defaultFeaturedOffersConfig;
  }
}

export function saveFeaturedOffersConfig(config: FeaturedOffersConfig) {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  writeFileSync(featuredConfigPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

export function getFeaturedOffersAdmin(): FeaturedOffersConfig {
  return readFeaturedConfig();
}
