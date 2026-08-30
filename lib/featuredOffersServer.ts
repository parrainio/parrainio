import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dataDir = join(process.cwd(), "data");
const featuredConfigPath = join(dataDir, "featured-config.json");

export function getFeaturedOfferSlugsServer(): string[] {
  if (existsSync(featuredConfigPath)) {
    try {
      const config = JSON.parse(readFileSync(featuredConfigPath, "utf8"));
      if (config.featuredOfferSlugs && Array.isArray(config.featuredOfferSlugs)) {
        return config.featuredOfferSlugs;
      }
    } catch {
      // Fall back to default
    }
  }
  
  // Default configuration
  return [
    "boursobank",
    "linxea", 
    "splint-invest",
    "revolut"
  ];
}
