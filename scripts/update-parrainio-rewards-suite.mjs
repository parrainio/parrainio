import fs from "node:fs";

const path = "data/offer-overrides.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

const updates = {
  "naomi-1": "1 €",
  phenix: "0 €",
  attapoll: "0 €",
  "swagbucks": "1 €",
  monabanq: "7,50 €",
  oney: "0 €",
  "topcashback": "2,50 € normal ; jusqu’à 7,50 € boosté",
  etoro: "40 €",
  "private-sport-shop": "0 €",
  bitstack: "1 €",
  "instant-gaming": "0 €",
  chain: "0 €",
  gmf: "0 €",
  carroos: "0 €",
  freecash: "0 €",
  "capital-koala": "1,25 €",
  kraken: "7,50 €",
  bibs: "0 €",
  "hello-watt": "0 €",
  bemyeye: "0 €",
  "bebe-boutik": "0 €",
  iron: "0 €",
  "fdj-francaise-des-jeux": "2,50 €",
  lalalab: "0 €",
  "assurancevie-com": "25 €",
  "meilleurtaux-com": "Assurance de prêt : 25 € ; Crédit immobilier : 50 € ; Mutuelle : 5 €",
  sumeria: "50 % de ma prime (actuellement 12,50 €)",
  edf: "5 €",
  hostinger: "25 % de ma prime (environ 10 € actuellement)",
  whatnot: "0 €",
  sumup: "5 €",
  "classe-des-marques": "0 €",
  "too-good-to-go": "0 €",
  feedmi: "0 €",
  "la-belle-vie": "0 €",
  cointiply: "0 €",
  "revolut-business": "150 €",
  okx: "5 €",
  fiverr: "0 €",
  raizers: "0 € par tranche de parrainage",
  simone: "0 €",
  "10-pourcent-1": "0 €",
  betsson: "2,50 € sous forme de pari / bonus de pari",
  "systeme-io": "50 % de ma prime",
  "liberte-watts": "0 €",
  scrambly: "0 €",
  klarna: "10 €",
  "splint-invest": "10 €",
  "rover-1": "0 €",
  alltricks: "0 €",
  "the-protein-works": "0 €",
  fitreva: "0 €",
  joybuy: "0 €",
  chaussea: "0 €",
  "chaussea-com": "0 €",
  "epargnoo-5": "25 €",
  myvitamins: "0 €",
  "cartouche-du-toner": "0 €",
  "la-bourse-aux-livres": "0 €",
  zemup: "0 €",
  speedo: "0 €",
  "coin-a": "25 % de ma prime",
  "credit-agricole-centre-loire": "10 €",
  biogen: "0 €",
  ludocortex: "0 €",
  ritmic: "0 €",
  zeconfiserie: "0 €",
  simplis: "10 €",
};

const protectedSlugs = new Set(["bienpreter", "betclic", "bitpanda", "bybit", "caisse-depargne-loire-centre"]);
const skippedProtected = [...protectedSlugs].filter((slug) => slug in data);
for (const slug of skippedProtected) delete updates[slug];

const missing = Object.keys(updates).filter((slug) => !(slug in data));
for (const slug of missing) delete updates[slug];
for (const [slug, reward] of Object.entries(updates)) data[slug].parrainioReward = reward;
fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(JSON.stringify({ updated: Object.keys(updates), skippedProtected, missing }, null, 2));
