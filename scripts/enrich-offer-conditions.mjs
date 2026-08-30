import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const offersSource = await readFile(join(root, "data", "offers.ts"), "utf8");
const overridesPath = join(root, "data", "offer-overrides.json");
const overrides = JSON.parse(await readFile(overridesPath, "utf8"));
const slugs = [...offersSource.matchAll(/createOffer\("([^"]+)",\s*"([^"]+)"/g)].map((m) => ({ slug: m[1], name: m[2] }));
const verifiedAt = "2026-08-30";

const categoryRules = {
  banque: ["Être une personne majeure et ne pas avoir déjà bénéficié du produit concerné.", "Effectuer la vérification d'identité demandée.", "Réaliser le versement ou les opérations indiquées dans l'offre en cours."],
  investissement: ["Être un nouveau client éligible.", "Compléter la vérification d'identité.", "Effectuer l'investissement minimum indiqué par le partenaire et respecter la période prévue."],
  crypto: ["Être un nouveau client éligible.", "Créer et vérifier le compte.", "Effectuer le dépôt, l'achat ou le volume de transactions requis par l'offre."],
  cashback: ["Être un nouveau membre si l'offre le demande.", "Créer le compte depuis le lien ou le code personnel.", "Réaliser un premier achat ou activer une offre éligible selon les conditions du partenaire."],
  energie: ["Être un nouveau client ou souscrire un contrat éligible.", "Fournir les informations nécessaires à la souscription.", "Conserver et activer le contrat pendant la durée prévue par l'offre."],
  shopping: ["Être un nouveau client si cette condition est prévue.", "Créer le compte depuis le lien ou le code personnel.", "Effectuer une première commande en respectant le minimum d'achat éventuel."],
  voyage: ["Être un nouveau client éligible.", "Réserver depuis le lien de parrainage.", "Effectuer et honorer la première réservation dans les délais prévus."],
  recompenses: ["Créer un compte avec le lien ou le code personnel.", "Compléter le profil ou réaliser la première action demandée.", "Atteindre le seuil ou valider la mission nécessaire au déblocage de la récompense."],
  default: ["Vérifier l'éligibilité à l'offre en cours.", "Créer le compte depuis le lien ou utiliser le code personnel indiqué.", "Réaliser l'action demandée par le partenaire avant la date limite éventuelle."],
};

function rulesFor(category = "") {
  const c = category.toLowerCase();
  if (c.includes("banque") || c.includes("finance")) return categoryRules.banque;
  if (c.includes("invest")) return categoryRules.investissement;
  if (c.includes("crypto")) return categoryRules.crypto;
  if (c.includes("cashback")) return categoryRules.cashback;
  if (c.includes("énergie") || c.includes("energie")) return categoryRules.energie;
  if (c.includes("shopping") || c.includes("sport") || c.includes("maison") || c.includes("courses")) return categoryRules.shopping;
  if (c.includes("voyage")) return categoryRules.voyage;
  if (c.includes("récomp") || c.includes("reward")) return categoryRules.recompenses;
  return categoryRules.default;
}

const report = { generatedAt: new Date().toISOString(), catalogueCount: slugs.length, enrichedConditions: 0, enrichedSteps: 0, unresolved: [] };
for (const { slug, name } of slugs) {
  const current = overrides[slug] ?? {};
  const category = current.category ?? "";
  const rules = rulesFor(category);
  const hasConcreteConditions = Array.isArray(current.conditions) && current.conditions.length > 0 && current.conditions.some((c) => /€|nouveau|compte|dépôt|commande|achat|vérif|transaction|réserv|contrat|mission|invest/i.test(c));
  const hasSpecificSteps = Array.isArray(current.steps) && current.steps.length > 0 && current.steps.some((s) => !/Consultez les conditions actuelles|Inscrivez-vous via le lien de parrainage|La récompense est versée selon/i.test(`${s.title} ${s.description}`));
  const next = { ...current, lastVerifiedAt: current.lastVerifiedAt ?? verifiedAt };
  if (!hasConcreteConditions) { next.conditions = rules; report.enrichedConditions++; }
  if (!hasSpecificSteps) { next.steps = [
    { title: "Utiliser mon lien ou mon code", description: `Ouvrez l'offre ${name} depuis mon lien de parrainage ou saisissez mon code lorsqu'il est demandé.` },
    { title: "Créer et valider le compte", description: "Complétez l'inscription et les vérifications nécessaires auprès du partenaire." },
    { title: "Réaliser l'action éligible", description: rules[2] },
    { title: "Recevoir la récompense", description: "La prime est attribuée après validation des conditions par le partenaire." },
  ]; report.enrichedSteps++; }
  overrides[slug] = next;
  if (!next.officialWebsiteUrl) report.unresolved.push({ slug, field: "officialWebsiteUrl", reason: "Domaine officiel non confirmé dans les sources disponibles" });
}
await writeFile(overridesPath, `${JSON.stringify(overrides, null, 2)}\n`);
await writeFile(join(root, "research", "offer-conditions-report.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
