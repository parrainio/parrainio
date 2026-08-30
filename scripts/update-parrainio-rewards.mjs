import fs from "node:fs";

const path = "data/offer-overrides.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

const updates = {
  totalenergies: "12,50 €",
  igraal: "0,75 €",
  sfr: "0 €",
  boursobank: "FREE : 7,50 € ; GOLD : 38 €",
  poulpeo: "1,25 €",
  paypal: "2,50 €",
  revolut: "40 €",
  ebuyclub: "1 €",
  airbnb: "0 €",
  shopmium: "0,25 €",
  showroomprive: "0 €",
  "hello-bank": "35 €",
  "trade-republic": "2,50 €",
  "direct-assurance": "12,50 €",
  "rakuten-priceminister": "0 €",
  winamax: "5 € sous forme de paris / bonus de paris",
  weward: "0 €",
  n26: "12,50 €",
  coinbase: "5 €",
  lolivier: "AUTO : 5 € ; HABITATION : 12,50 €",
  "crypto-com": "20 €",
  "primeo-energie": "5 €",
  unibet: "5 € sous forme de paris / bonus de paris",
  widilo: "1,25 €",
  zeconfiserie: "0 €",
  linxea: "12,50 € en cash",
  bricks: "0,25 % du montant investi",
  swissborg: "25 % de ma prime (entre 0,25 € et 12,50 € selon la prime)",
  myprotein: "0 €",
  "coupon-network": "0 €",
  pmu: "0 €",
  "hello-fresh": "0 €",
  engie: "0 €",
  "la-premiere-brique-1": "0,25 % du premier investissement",
  "macadam-4": "0 €",
};

for (const [slug, reward] of Object.entries(updates)) {
  if (!data[slug]) throw new Error(`Missing override: ${slug}`);
  if (slug === "betclic") throw new Error("Betclic must not be changed");
  data[slug].parrainioReward = reward;
}

fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Updated ${Object.keys(updates).length} Parrainio rewards.`);
