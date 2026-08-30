import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const path = join(root, "data", "offer-overrides.json");
const data = JSON.parse(await readFile(path, "utf8"));
const generic = /vérif(?:ier|iez) (?:l['’]éligibilité|son identité)|consultez les conditions actuelles|créez? (?:un )?compte depuis le lien|inscrivez-vous via le lien de parrainage|réalisez l'action demandée|respectez les conditions (?:affichées|de l'offre)|la récompense est (?:attribuée|versée) après validation|action éligible/i;
for (const entry of Object.values(data)) {
  if (Array.isArray(entry.conditions)) {
    entry.conditions = entry.conditions.filter((value) => typeof value === "string" && !generic.test(value));
    if (!entry.conditions.length) delete entry.conditions;
  }
  if (Array.isArray(entry.steps)) {
    entry.steps = entry.steps.filter((step) => !generic.test(`${step.title} ${step.description}`));
    if (!entry.steps.length) delete entry.steps;
  }
}
await writeFile(path, `${JSON.stringify(data, null, 2)}\n`);
console.log("Removed generic conditions and steps; concrete researched content was preserved.");
