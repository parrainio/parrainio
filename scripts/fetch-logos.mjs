import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const domains = JSON.parse(readFileSync(join("data", "company-domains.json"), "utf8"));
const logoDir = join("public", "logos");
const indexPath = join("data", "logo-index.json");

mkdirSync(logoDir, { recursive: true });

const existing = existsSync(indexPath)
  ? JSON.parse(readFileSync(indexPath, "utf8"))
  : {};

async function fetchBuffer(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "ParrainioLogoFetcher/1.0" },
    redirect: "follow",
  });
  if (!response.ok) return null;
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("image") && !type.includes("octet-stream") && !type.includes("icon")) {
    return null;
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 80) return null;
  return { buffer, type };
}

function extensionFor(type) {
  if (type.includes("svg")) return ".svg";
  if (type.includes("png")) return ".png";
  if (type.includes("webp")) return ".webp";
  if (type.includes("jpeg") || type.includes("jpg")) return ".jpg";
  return ".png";
}

async function fetchLogo(domain) {
  const urls = [
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  ];

  for (const url of urls) {
    try {
      const result = await fetchBuffer(url);
      if (result) return result;
    } catch {
      // try next source
    }
  }
  return null;
}

const slugs = Object.keys(domains);
let saved = 0;

for (const slug of slugs) {
  if (existing[slug]?.logo) continue;
  const domain = domains[slug];
  const result = await fetchLogo(domain);
  if (!result) continue;
  const ext = extensionFor(result.type);
  const filename = `${slug}${ext}`;
  writeFileSync(join(logoDir, filename), result.buffer);
  existing[slug] = {
    logo: `/logos/${filename}`,
    logoVerified: false,
  };
  saved += 1;
}

writeFileSync(indexPath, `${JSON.stringify(existing, null, 2)}\n`);
console.log(`Logos saved: ${saved}. Indexed: ${Object.keys(existing).length}`);
