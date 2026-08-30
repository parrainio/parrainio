import fs from 'node:fs';

const path = 'data/offer-overrides.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const conditionPatterns = [
  /Créer le compte depuis le lien/i,
  /Utiliser le lien ou le code/i,
  /Réaliser l'action demandée/i,
  /Vérifier son éligibilité/i,
  /Respecter les conditions/i,
  /Consulter les conditions/i,
  /Attendre la validation/i,
  /Effectuer l'action demandée/i,
];
const stepTitlePatterns = [
  /utiliser mon lien ou mon code/i,
  /créer et valider le compte/i,
  /recevoir la récompense/i,
];
const stepDescriptionPatterns = [
  /complétez l'inscription et les vérifications nécessaires auprès du partenaire/i,
  /la prime est attribuée après validation des conditions par le partenaire/i,
  /ouvrez l'offre .* depuis mon lien de parrainage ou saisissez mon code lorsqu'il est demandé/i,
];
const isGeneric = (value, patterns) => patterns.some((pattern) => pattern.test(value));

for (const offer of Object.values(data)) {
  if (Array.isArray(offer.conditions)) {
    offer.conditions = offer.conditions.filter((condition) => !isGeneric(String(condition), conditionPatterns));
  }
  if (Array.isArray(offer.steps)) {
    offer.steps = offer.steps.filter((step) => {
      const title = String(step?.title ?? '');
      const description = String(step?.description ?? '');
      return !isGeneric(title, stepTitlePatterns) && !isGeneric(description, stepDescriptionPatterns);
    });
  }
}

fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log('Generic template content removed.');
