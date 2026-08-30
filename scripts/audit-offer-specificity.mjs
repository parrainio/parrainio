import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
const root = process.cwd();
const source = await readFile(join(root, "data", "offers.ts"), "utf8");
const overrides = JSON.parse(await readFile(join(root, "data", "offer-overrides.json"), "utf8"));
const slugs = [...source.matchAll(/createOffer\("([^"]+)/g)].map((m) => m[1]);
const specificity = /€|%|nouveau client|première commande|premier achat|dépôt|versement|transaction|paiement|carte|réservation|contrat|abonnement|identité|mission|invest|minimum|délai|jour|mois|code|coupon|panier|commande|seuil|points|marchand|logement|expérience/i;
const report = { generatedAt: new Date().toISOString(), catalogueCount: slugs.length, specificConditions: 0, specificSteps: 0, complete: 0, incomplete: [] };
for (const slug of slugs) {
 const o=overrides[slug]??{}; const conditions=Array.isArray(o.conditions)?o.conditions:[]; const steps=Array.isArray(o.steps)?o.steps:[];
 const c=conditions.length>0 && conditions.some(x=>specificity.test(x)); const s=steps.length>0 && steps.some(x=>specificity.test(`${x.title} ${x.description}`));
 if(c) report.specificConditions++; if(s) report.specificSteps++; if(c&&s) report.complete++; else report.incomplete.push({slug, missing:[...(c?[]:["conditions"]),...(s?[]:["steps"])]});
}
await writeFile(join(root,"research","offer-specificity-report.json"),`${JSON.stringify(report,null,2)}\n`); console.log(JSON.stringify(report,null,2));
