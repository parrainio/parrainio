import { readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const source = await readFile(join(root, "data", "offers.ts"), "utf8");
const overrides = JSON.parse(await readFile(join(root, "data", "offer-overrides.json"), "utf8"));
const slugs = [...source.matchAll(/createOffer\(\"([^\"]+)/g)].map((m) => m[1]);
const fallback = (slug) => ({ slug, ...(overrides[slug] ?? {}) });
const genericStep = (steps = []) => steps.length === 0 || steps.every((s) => /Consultez les conditions actuelles|Inscrivez-vous via le lien de parrainage|La récompense est versée selon les conditions/i.test(`${s.title} ${s.description}`));
const genericCondition = (conditions = []) => conditions.length === 0 || conditions.every((c) => /vérifiez votre éligibilité|consultez les conditions|peuvent évoluer/i.test(c));
const report = { generatedAt: new Date().toISOString(), catalogueCount: slugs.length, complete: 0, bonusVerified: 0, conditionsVerified: 0, stepsCompleted: 0, officialLink: 0, personalLink: 0, incomplete: [] };
for (const slug of slugs) {
  const o = fallback(slug); const missing = [];
  const bonus = o.partnerReward ?? o.bonus;
  if (!bonus || /^voir l'offre$/i.test(bonus) || /aucun avantage/i.test(bonus)) missing.push("bonus: montant partenaire non communiqué"); else report.bonusVerified++;
  if (genericCondition(o.conditions)) missing.push("conditions: absentes ou génériques"); else report.conditionsVerified++;
  if (genericStep(o.steps)) missing.push("steps: absentes ou génériques"); else report.stepsCompleted++;
  if (!o.officialWebsiteUrl) missing.push("officialWebsiteUrl: absent"); else report.officialLink++;
  if (o.referralLink || o.referralCode) report.personalLink++; else missing.push("referral: lien/code personnel non trouvé");
  if (!missing.length) report.complete++; else report.incomplete.push({ slug, missing });
}
await import("node:fs/promises").then(({ writeFile }) => writeFile(join(root, "research", "offer-enrichment-audit.json"), `${JSON.stringify(report, null, 2)}\n`));
console.log(JSON.stringify(report, null, 2));
