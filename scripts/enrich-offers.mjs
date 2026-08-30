import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const offersPath = join(root, "data", "offers.ts");
const overridesPath = join(root, "data", "offer-overrides.json");
const reportPath = join(root, "research", "parrainage-co-report.json");
const verifiedAt = "2026-08-30";

const officialUrls = {
  "rakuten-priceminister": "https://fr.shopping.rakuten.com/",
  "hello-fresh": "https://www.hellofresh.fr/",
  phenix: "https://www.wearephenix.com/",
  "meilleurtaux-com": "https://www.meilleurtaux.com/",
  edf: "https://particulier.edf.fr/",
  placesdescartes: "https://www.placedescartes.fr/",
  "revolut-business": "https://www.revolut.com/fr-FR/business/",
  reevolt: "https://reevolt.fr/",
  "la-bourse-aux-livres": "https://labourseauxlivres.fr/",
  "credit-agricole-centre-loire": "https://www.credit-agricole.fr/ca-centreloire/",
  ritmic: "https://www.ritmic.com/",
  zeconfiserie: "https://www.zeconfiserie.com/",
  simplis: "https://www.simplis.fr/",
};

const specific = {
  "rakuten-priceminister": ["Utilisez mon lien de parrainage et créez votre compte Rakuten.", "Effectuez votre première commande éligible, avec le minimum d'achat indiqué au moment de l'inscription.", "Le coupon ou bonus est attribué selon les conditions en vigueur."],
  "hello-fresh": ["Utilisez mon lien de parrainage et créez votre compte HelloFresh.", "Choisissez une box et validez votre première commande éligible.", "Respectez les conditions d'abonnement et de paiement affichées avant validation."],
  phenix: ["Utilisez mon lien de parrainage et créez votre compte Phenix.", "Réservez et payez un panier anti-gaspillage éligible.", "Récupérez le panier dans le créneau indiqué pour valider l'action."],
  "meilleurtaux-com": ["Utilisez mon lien de parrainage et complétez votre demande.", "Fournissez les informations et justificatifs nécessaires à l'étude.", "L'avantage est accordé si la demande remplit les critères de l'offre."],
  edf: ["Utilisez mon lien de parrainage et souscrivez une offre EDF éligible.", "Finalisez la souscription avec les informations du titulaire.", "Activez le contrat et respectez les éventuelles conditions de maintien."],
  placesdescartes: ["Utilisez mon lien de parrainage et créez votre compte.", "Choisissez puis commandez une carte cadeau éligible.", "Recevez l'avantage après validation de la commande."],
  "revolut-business": ["Utilisez mon lien de parrainage et commencez la demande de compte professionnel.", "Fournissez les informations légales et vérifiez l'identité de l'entreprise.", "Activez le compte et respectez les conditions du programme professionnel."],
  reevolt: ["Utilisez mon lien de parrainage et demandez une offre éligible.", "Finalisez la souscription et activez le contrat.", "Conservez le contrat selon les conditions prévues pour obtenir l'avantage."],
  "la-bourse-aux-livres": ["Utilisez mon lien de parrainage et créez votre compte.", "Achetez ou déposez un livre selon le programme proposé.", "Validez l'opération et attendez la confirmation de l'avantage."],
  "credit-agricole-centre-loire": ["Utilisez mon lien de parrainage et prenez contact avec l'agence.", "Ouvrez le produit bancaire éligible et fournissez les justificatifs.", "Effectuez les opérations demandées pour valider la prime."],
  ritmic: ["Utilisez mon lien de parrainage et créez votre compte.", "Activez le service ou passez la commande éligible.", "Respectez les conditions affichées pour recevoir l'avantage."],
  zeconfiserie: ["Utilisez mon lien de parrainage et créez votre compte.", "Passez une première commande éligible.", "Respectez le minimum éventuel et attendez la validation."],
  simplis: ["Utilisez mon lien de parrainage et demandez un devis.", "Renseignez les informations de votre activité.", "Souscrivez le contrat éligible et fournissez les justificatifs requis."],
};

const source = await readFile(offersPath, "utf8");
const slugs = [...source.matchAll(/createOffer\(\"([^\"]+)/g)].map((m) => m[1]);
const overrides = JSON.parse(await readFile(overridesPath, "utf8"));
const report = JSON.parse(await readFile(reportPath, "utf8"));
const bySlug = new Map();
for (const item of report.offers) {
  const slug = item.existingMatch?.slug;
  if (slug && item.ownerVerified && item.status === 200 && !bySlug.has(slug)) bySlug.set(slug, item);
}

for (const slug of slugs) {
  const current = overrides[slug] ?? {};
  const item = bySlug.get(slug);
  const next = { ...current, lastVerifiedAt: current.lastVerifiedAt ?? verifiedAt };
  if (item) {
    const personalLink = item.candidates?.referralUrls?.find((url) => !url.includes("parrainage.co"));
    const personalCode = item.candidates?.codeCandidates?.find((value) => !/^(auto|promo|inscription|parrain|parrainage)$/i.test(value));
    if (personalLink && !current.referralLink) next.referralLink = personalLink;
    if (personalCode && !current.referralCode) next.referralCode = personalCode;
    next.researchSource = item.sourceUrl;
    if ((!current.partnerReward || /^voir l'offre$/i.test(current.partnerReward)) && item.candidates?.rewardCandidates?.length === 1) next.partnerReward = `${item.candidates.rewardCandidates[0]} €`;
  }
  if (officialUrls[slug] && !current.officialWebsiteUrl) next.officialWebsiteUrl = officialUrls[slug];
  if (specific[slug]) {
    if (!current.steps || current.steps.every((step) => /Consultez les conditions actuelles|Inscrivez-vous via le lien de parrainage/i.test(step.description))) next.steps = specific[slug].map((description, i) => ({ title: ["Inscription", "Action requise", "Validation"][i], description }));
  }
  overrides[slug] = next;
}
await import("node:fs/promises").then(({ writeFile }) => writeFile(overridesPath, `${JSON.stringify(overrides, null, 2)}\n`));
console.log(`Processed ${slugs.length} catalogue offers; preserved all existing Parrainio rewards.`);
