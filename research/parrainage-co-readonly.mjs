import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const profileUrl = "https://parrainage.co/user/mathieu45510";
const expectedUser = "mathieu45510";
const outputPath = new URL("./parrainage-co-report.json", import.meta.url);
const userAgent = "Parrainio-read-only-research/1.0";

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripHtml(value) {
  return decodeHtml(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function getAttribute(html, tagName, attribute, value) {
  const pattern = new RegExp(
    `<${tagName}\b[^>]*${attribute}=["']${value}["'][^>]*content=["']([\s\S]*?)["'][^>]*>`,
    "i",
  );
  return decodeHtml(pattern.exec(html)?.[1] ?? "").trim() || null;
}

function extractCanonical(html) {
  return /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i.exec(html)?.[1] ?? null;
}

function extractOfferLinks(html) {
  return [...html.matchAll(/href=["'](\/offers\/\d+)["']/gi)]
    .map((match) => new URL(match[1], profileUrl).href)
    .filter((url, index, values) => values.indexOf(url) === index);
}

function normalizeName(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(by|le|la|les|de|du|des|the)\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function extractCandidates(text) {
  const rewardCandidates = [...text.matchAll(/(?:jusqu['’àa]*\s*)?(\d[\d ]*(?:[,.]\d+)?)\s*€/gi)]
    .map((match) => match[1].replace(/ /g, ""))
    .filter((value) => Number(value.replace(",", ".")) <= 10000)
    .filter((value, index, values) => values.indexOf(value) === index)
    .slice(0, 20);
  const reversalPercentCandidates = [...text.matchAll(/(\d{1,3})\s*%[^.]{0,40}(?:revers|prime|parrain)/gi)]
    .map((match) => Number(match[1]))
    .filter((value, index, values) => values.indexOf(value) === index);
  const reversalAmountCandidates = [...text.matchAll(/(?:revers|reverse|r[eé]troc[eè]de)[^€]{0,35}(\d[\d ]*(?:[,.]\d+)?)\s*€/gi)]
    .map((match) => match[1].replace(/ /g, ""))
    .filter((value, index, values) => values.indexOf(value) === index);
  const referralUrls = [...text.matchAll(/https?:\/\/(?!parrainage\.co)[^\s<>()]+/gi)]
    .map((match) => match[0].replace(/[.,;:)]+$/, ""))
    .filter((url) => !url.includes("google") && !url.includes("facebook"))
    .filter((url, index, values) => values.indexOf(url) === index);
  const codeCandidates = [
    ...text.matchAll(/code\s+(?:de\s+)?(?:parrainage|parrain)\s*:?\s*([A-Z0-9][A-Z0-9_-]{3,})/gi),
    ...text.matchAll(/code\s*:\s*([A-Z0-9][A-Z0-9_-]{3,})/gi),
    ...text.matchAll(/code\s+(?!parrainage\b|parrain\b)([A-Z0-9][A-Z0-9_-]{3,})/gi),
  ]
    .map((match) => match[1])
    .filter((value) => !/^(code|parrain|parrainage)$/i.test(value))
    .filter((value, index, values) => values.indexOf(value) === index);

  return {
    rewardCandidates,
    reversalPercentCandidates,
    reversalAmountCandidates,
    referralUrls,
    codeCandidates,
  };
}

function parseExistingOffers(source) {
  return [...source.matchAll(/createOffer\("([^"]+)",\s*"([^"]+)"/g)].map((match) => ({
    slug: match[1],
    name: match[2],
    normalizedName: normalizeName(match[2]),
  }));
}

function matchExistingOffer(name, existingOffers) {
  const normalizedName = normalizeName(name);
  const exact = existingOffers.find((offer) => offer.normalizedName === normalizedName);
  if (exact) return { status: "exact-name", ...exact };

  const contains = existingOffers.filter(
    (offer) => offer.normalizedName.includes(normalizedName) || normalizedName.includes(offer.normalizedName),
  );
  if (contains.length === 1) return { status: "candidate-name", ...contains[0] };
  return { status: "unmatched", candidates: contains.map(({ slug, name }) => ({ slug, name })) };
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { "user-agent": userAgent } });
  return { response, html: await response.text() };
}

const existingSource = await readFile(new URL("../data/offers.ts", import.meta.url), "utf8");
const existingOffers = parseExistingOffers(existingSource);
const profile = await fetchText(profileUrl);
if (!profile.response.ok) throw new Error(`Profile request failed: ${profile.response.status}`);

const offerUrls = extractOfferLinks(profile.html);
const profileText = stripHtml(profile.html);
const report = {
  generatedAt: new Date().toISOString(),
  source: { profileUrl, expectedUser, profileStatus: profile.response.status, declaredActiveCount: Number(/(\d+)\s*annonces\s*actives/i.exec(profileText)?.[1] ?? 0), discoveredOfferCount: offerUrls.length },
  extraction: { method: "public profile links then sequential public offer pages", userAgent, privateRoutesAccessed: false, structuredDataFound: false, apiUsed: false },
  offers: [],
  comparison: { existingCatalogueCount: existingOffers.length, exactMatches: 0, candidateMatches: 0, unmatched: 0, duplicateSourceIds: [], duplicateExistingMatches: [], missingFromParrainio: [], existingOffersNotInSource: [], potentiallyOutdated: [] },
};

for (const [index, url] of offerUrls.entries()) {
  const { response, html } = await fetchText(url);
  const text = stripHtml(html);
  const title = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1];
  const name = title ? stripHtml(title).replace(/^Mathieu45510 vous parraine sur /i, "").trim() : null;
  const id = /\/offers\/(\d+)/.exec(url)?.[1] ?? null;
  const siteUrl = [...html.matchAll(/href=["'](\/site\/[^"']+)["']/gi)].map((match) => new URL(match[1], url).href)[0] ?? null;
  const ownerVerified = text.toLowerCase().includes(`/user/${expectedUser}`) || text.toLowerCase().includes(expectedUser);
  const candidates = extractCandidates(text);
  const match = name ? matchExistingOffer(name, existingOffers) : { status: "unmatched", candidates: [] };
  const sourceRecord = {
    sourceId: id,
    sourceUrl: url,
    status: response.status,
    canonicalUrl: extractCanonical(html),
    companyName: name,
    siteUrl,
    publishedAt: /Annonce publiée le\s+(\d{2}-\d{2}-\d{4})/i.exec(text)?.[1] ?? null,
    ownerVerified,
    title: getAttribute(html, "meta", "property", "og:title") ?? name,
    description: getAttribute(html, "meta", "name", "description"),
    candidates,
    contentHash: createHash("sha256").update(html).digest("hex"),
    existingMatch: match,
  };
  report.offers.push(sourceRecord);
  if (match.status === "exact-name") report.comparison.exactMatches += 1;
  else if (match.status === "candidate-name") report.comparison.candidateMatches += 1;
  else report.comparison.unmatched += 1;
  if (!ownerVerified || response.status !== 200) report.comparison.potentiallyOutdated.push({ sourceId: id, reason: !ownerVerified ? "owner-not-verified" : `http-${response.status}` });
  process.stdout.write(`\rFetched ${index + 1}/${offerUrls.length}`);
}
process.stdout.write("\n");

const groupedIds = Object.groupBy(report.offers, (offer) => offer.sourceId);
report.comparison.duplicateSourceIds = Object.entries(groupedIds).filter(([, values]) => values.length > 1).map(([sourceId]) => sourceId);
report.comparison.missingFromParrainio = report.offers.filter((offer) => offer.existingMatch.status === "unmatched").map((offer) => ({ sourceId: offer.sourceId, companyName: offer.companyName, sourceUrl: offer.sourceUrl }));
const groupedMatches = Object.groupBy(report.offers.filter((offer) => offer.existingMatch.slug), (offer) => offer.existingMatch.slug);
report.comparison.duplicateExistingMatches = Object.entries(groupedMatches)
  .filter(([, values]) => values.length > 1)
  .map(([slug, values]) => ({ slug, sourceOffers: values.map((offer) => ({ sourceId: offer.sourceId, companyName: offer.companyName })) }));
const matchedSlugs = new Set(report.offers.filter((offer) => offer.existingMatch.slug).map((offer) => offer.existingMatch.slug));
report.comparison.existingOffersNotInSource = existingOffers
  .filter((offer) => !matchedSlugs.has(offer.slug))
  .map(({ slug, name }) => ({ slug, name }));
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report.comparison, null, 2));
console.log(`Report written to ${outputPath.pathname}`);
