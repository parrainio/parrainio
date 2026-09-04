export type OfferStep = {
  title: string;
  description: string;
};

export type OfferCondition = string;

export type Offer = {
  slug: string;
  name: string;
  category: string;
  categoryGroup: OfferCategory;
  bonus: string;
  partnerReward: string;
  parrainioReward: string | null;
  referralCode: string | null;
  referralLink: string | null;
  officialWebsiteUrl: string | null;
  description: string;
  color: string;
  logoLetter: string;
  logo: string | null;
  logoVerified: boolean;
  referralUrl: string;
  sourceUrl: string;
  partnerBonusLabel: string;
  steps: OfferStep[];
  conditions: OfferCondition[];
  publicationDate: string | null;
  lastVerifiedAt?: string | null;
  researchSource?: string | null;
};

export type OfferCategory =
  | "Banque & Finance"
  | "Cashback"
  | "Énergie"
  | "Téléphone & Internet"
  | "Voyage & Mobilité"
  | "Shopping & Courses"
  | "Investissement & Crypto"
  | "Récompenses & Applications"
  | "Jeux & Paris"
  | "Services numériques"
  | "Autres bons plans"
  | "Sans dépôt ou avec 1 €"
  | "Instantané";

const categoryGroups: Record<string, OfferCategory> = {
  Banque: "Banque & Finance",
  "Banque & transferts": "Banque & Finance",
  Finance: "Banque & Finance",
  "Finance & shopping": "Banque & Finance",
  "Pro & finance": "Banque & Finance",
  Cashback: "Cashback",
  Énergie: "Énergie",
  "Téléphonie & Internet": "Téléphone & Internet",
  Voyage: "Voyage & Mobilité",
  Mobilité: "Voyage & Mobilité",
  Services: "Services numériques",
  sondage: "Récompenses & Applications",
  Shopping: "Shopping & Courses",
  Courses: "Shopping & Courses",
  "Courses & anti-gaspi": "Shopping & Courses",
  Investissement: "Investissement & Crypto",
  Crypto: "Investissement & Crypto",
  // Requalification « Autres bons plans » (architecture validée) :
  // e-commerce vers Shopping & Courses, finance/assurance vers Banque & Finance,
  // nouvelles familles Récompenses & Applications, Jeux & Paris, Services numériques.
  Sport: "Shopping & Courses",
  "Sport & nutrition": "Shopping & Courses",
  "Sport & shopping": "Shopping & Courses",
  Gaming: "Shopping & Courses",
  Maison: "Shopping & Courses",
  "Bébé": "Shopping & Courses",
  "Mode & shopping": "Shopping & Courses",
  "Jeux & loisirs": "Shopping & Courses",
  Alimentation: "Shopping & Courses",
  "Maison & shopping": "Shopping & Courses",
  Assurance: "Banque & Finance",
  "Assurance auto": "Banque & Finance",
  "Pro & assurance": "Banque & Finance",
  "Épargne & assurance-vie": "Banque & Finance",
  Récompenses: "Récompenses & Applications",
  "Jeux & paris": "Jeux & Paris",
  "Web & numérique": "Services numériques",
};

const recoveredReferralCodes: Record<string, string> = {
  sfr: "REDCE6C79C",
  pmu: "578692128",
  engie: "RAD735473",
  myprotein: "MATHIEU-R90D",
  bemyeye: "rz85530",
  betclic: "CARTUNDM",
  "coupon-network": "F5YT68",
  fortuneo: "14241677",
  "greenweez-6": "02A919B8",
  thefork: "1FAA4AD8",
  n26: "mathieum67329c",
  "private-sport-shop": "4X0866D259V8",
  shopmium: "UK2UP4",
  showroomprive: "MATAAP9C",
  totalenergies: "104954582",
  weward: "JustePerche8874",
  winamax: "NOBYTA",
  shein: "35MW4M5",
  swissborg: "mathieKRBOTGJN",
  okx: "56233266",
  choose: "MATHIEUM014",
  lolivier: "LOA-ZLTT88",
  karos: "btgcdw",
  bienpreter: "U69DA2CFB2C9D2",
  fizzer: "MATHI204529",
  "crypto-com": "pwh4bxfcya",
  myvitamins: "MATHIEU-R3B",
  "naomi-1": "B3PW1X",
  bybit: "2A3P1OP",
  attapoll: "LNCGY",
  "la-premiere-brique-1": "BHVAEO",
  lalalab: "PGXJD6VQ",
  "cartouche-du-toner": "272616805",
  fidme: "AKFW2M",
  speedo: "MATHIEU-R6I",
  nutripure: "1283007804",
  "assurancevie-com": "MAMO098179",
  becquet: "726083989653",
  "epargnoo-5": "MAMO7017",
  "hello-watt": "HW-91-IAIL",
  sumeria: "WYU2AN9J56",
  "liberte-watts": "750152",
  ludocortex: "264098807",
  joybuy: "3YZ7MU",
  coinhouse: "UU55D4",
  scrambly: "FEYW8CA",
  "10-pourcent-1": "2OGGXEHL",
};

const recoveredReferralLinks: Record<string, string> = {
  pmu: "https://www.pmu.fr/turf/static/offre-parrainage/?codeParrainage=578692128",
  myprotein: "https://fr.myprotein.com/referrals.list?applyCode=MATHIEU-R90D",
  bemyeye: "https://invitation.bemyeye.com/invitation/rz85530?lc=fr_FR",
  betclic: "https://go.onelink.me/2887093520/6c3132b8?af_sub5=CARTUNDM",
  boursobank: "https://bour.so/p/7rQmVJLmaxE",
  coinbase: "https://coinbase.com/join/R8HUK4G?src=referral-link",
  ebuyclub: "https://www.ebuyclub.com/inscription?parrain=mathieumorin2",
  monabanq: "https://www.monabanq.com/fr/parrainage/index.html?IDPEREFPRINCIPALE=280189512&CODEPROMO=PARCTC&CAMTYPE=PARRAINAGE&SUPPORT=EMAIL&codeParrain=17H9W",
  "private-sport-shop": "https://www.privatesportshop.fr/join/4X0866D259V8",
  revolut: "https://revolut.com/referral/?referral-code=mathie_1r_ks2p!AUG1-26-AR-H2&geo-redirect",
  wise: "https://wise.com/invite/dic/mathieum865",
  unibet: "https://www.unibet.fr/inscription/?campaign=280526&parrain=6EB8BDE7346E88CB",
  winamax: "https://www.winamax.fr/parrain?code=NOBYTA",
  honeygain: "https://join.honeygain.com/BIDOUB6085",
  okx: "https://my.okx.com/fr-fr/join/56233266",
  "trade-republic": "https://refnocode.trade.re/p72z37d0",
  bienpreter: "https://www.bienpreter.com/parrain/U69DA2CFB2C9D2",
  myvitamins: "https://www.myvitamins.fr/referrals.list?applyCode=MATHIEU-R3B",
  "naomi-1": "http://onelink.to/c82h4h",
  bybit: "https://www.bybit.eu/invite?ref=2A3P1OP",
  "parions-sport": "https://www.enligne.parionssport.fdj.fr/inscription/?campaign=100326&parrain=B0A5CC03D1539CDF",
  wanteeed: "https://wanteeed.com/join/35a08af8e6d04f3c8e0d757ff71cf7d8",
  kraken: "https://invite.kraken.com/JDNW/0v5m8s5a",
  "c-monetiquette": "https://www.c-monetiquette.fr/invitation_static_fr.html?referralcode=Ymlkb3VjaGUwNDVAZ21haWwuY29tfDE",
  hostinger: "https://www.hostinger.com/fr?REFERRALCODE=FIRBIDOUCFHJ",
  pourdebon: "https://www.pourdebon.com/invite?p=tSdFVaMd",
  topcashback: "https://www.topcashback.fr/ref/member41551793542",
  bitstack: "https://bitstack-app.com/referral/3HJ3sBdeCp9gh2eSbPA74J8V1TU",
  "epargnoo-5": "https://epargnoo.com/inscription?code=MAMO7017&utm_source=spons",
  betsson: "https://betsson.fr/fr/%23register?language=fr&referralCode=ToDkM0",
  "rover-1": "https://www.rover.com/ambas-refer-a-friend/QrKrOWGA",
  "fdj-francaise-des-jeux": "https://www.fdj.fr/inscription/fdj?parrain=32FD2-A5E51-3A9D9&campaign=codeparrain",
  whatnot: "https://whatnot.com/invite/mathieumor25752",
  sumup: "https://join.sumup.com/cKYwEgAv?share_id=tbqks4Pckywegav124788",
};

const defaultSteps = (name: string): OfferStep[] => [
  {
    title: "Accédez à l'offre",
    description: `Consultez les conditions actuelles de ${name} avant de commencer.`,
  },
  {
    title: "Suivez le parcours",
    description:
      "Inscrivez-vous via le lien de parrainage et réalisez les actions demandées.",
  },
  {
    title: "Profitez de l'avantage",
    description:
      "La récompense est versée selon les conditions en vigueur de l'offre.",
  },
];

const defaultConditions = (): OfferCondition[] => [];

const colors: Record<string, string> = {
  Banque: "#075846",
  "Banque & transferts": "#075846",
  Cashback: "#d5722b",
  Énergie: "#2f765f",
  "Téléphonie & Internet": "#245f56",
  Assurance: "#466f66",
  "Assurance auto": "#466f66",
  Investissement: "#34495e",
  "Épargne & assurance-vie": "#436b60",
  Crypto: "#20252b",
  Shopping: "#b65e35",
  Maison: "#70614e",
  "Maison & shopping": "#70614e",
  Courses: "#557b54",
  "Courses & anti-gaspi": "#557b54",
  Sport: "#385e76",
  "Sport & nutrition": "#385e76",
  "Sport & shopping": "#385e76",
  "Jeux & paris": "#66505b",
  Récompenses: "#8a6a2f",
  Mobilité: "#4a6d70",
  Voyage: "#3d7180",
  Restaurants: "#8b634e",
  Gaming: "#515a75",
  Bébé: "#886b78",
  Animaux: "#65735b",
  Finance: "#405f55",
  "Finance & shopping": "#6a5d58",
  "Pro & finance": "#3d625a",
  "Pro & assurance": "#466f66",
  "Web & numérique": "#46566c",
  Services: "#5b6660",
  Alimentation: "#7b5f48",
};

function createOffer(
  slug: string,
  name: string,
  category: string,
  bonus: string,
  logoLetter: string,
): Offer {
  return {
    slug,
    name,
    category,
    categoryGroup: categoryGroups[category] ?? "Autres bons plans",
    bonus,
    partnerReward: bonus,
    parrainioReward: null,
    description: generateDescription(name, category),
    color: colors[category] ?? "#075846",
    logoLetter,
    referralUrl: "#",
    referralCode: recoveredReferralCodes[slug] ?? null,
    referralLink: recoveredReferralLinks[slug] ?? null,
    officialWebsiteUrl: null,
    sourceUrl: `https://www.super-parrain.com/offres/${slug}`,
    partnerBonusLabel: bonus,
    steps: defaultSteps(name),
    conditions: defaultConditions(),
    logo: null,
    logoVerified: false,
    publicationDate: null,
  };
}

function generateDescription(name: string, category: string): string {
  const descriptions: Record<string, string> = {
    "BoursoBank": "BoursoBank est une banque en ligne française qui propose des comptes courants, des livrets d'épargne et des services d'investissement avec des frais généralement réduits.",
    "Fortuneo": "Fortuneo est une banque en ligne française reconnue pour ses comptes sans frais et ses offres d'épargne compétitives.",
    "Linxea": "Linxea est un courtier en assurance-vie et en épargne retraite qui propose des contrats d'investissement avec des frais réduits.",
    "Splint Invest": "Splint Invest est une plateforme d'investissement qui permet d'investir dans des projets immobiliers avec des montants minimums accessibles.",
    "Revolut": "Revolut est une application financière qui propose des comptes bancaires, des virements internationaux et du trading d'actions et de crypto-monnaies.",
    "N26": "N26 est une banque mobile allemande qui propose des comptes courants gratuits et une expérience bancaire 100% mobile.",
    "Trade Republic": "Trade Republic est un courtier en ligne allemand qui permet d'investir en bourse avec des frais réduits.",
    "SwissBorg": "SwissBorg est une plateforme de crypto-monnaies basée en Suisse qui propose des services d'investissement et de trading.",
    "Crypto.com": "Crypto.com est une plateforme de crypto-monnaies qui propose des services d'achat, de vente et de trading de cryptomonnaies.",
    "Coinbase": "Coinbase est l'une des plus grandes plateformes d'échange de crypto-monnaies au monde, permettant d'acheter et de vendre des cryptomonnaies.",
    "Betclic": "Betclic est un site de paris sportifs en ligne qui propose des cotes sur de nombreux événements sportifs.",
    "Winamax": "Winamax est un site de poker et de paris sportifs en ligne très populaire en France.",
    "iGraal": "iGraal est une plateforme de cashback qui permet de récupérer une partie de ses achats en ligne.",
    "Poulpeo": "Poulpeo est un site de cashback et de coupons de réduction pour les achats en ligne.",
    "eBuyClub": "eBuyClub est un club d'achat en ligne qui propose des réductions et du cashback sur de nombreux marchands.",
    "Widilo": "Widilo est une plateforme de cashback qui permet de gagner de l'argent sur ses achats en ligne.",
    "TopCashback": "TopCashback est un site de cashback international qui propose des remboursements sur les achats en ligne.",
    "TheFork": "TheFork (anciennement LaFourchette) est une plateforme de réservation de restaurants avec des offres promotionnelles.",
    "Shopmium": "Shopmium est une application mobile qui propose des coupons de réduction et des remboursements sur les courses.",
    "Showroomprivé": "Showroomprivé est un site de ventes privées qui propose des réductions sur des marques de mode et de décoration.",
    "Hello Bank": "Hello Bank! est la banque en ligne du groupe BNP Paribas proposant des comptes sans frais.",
    "Monabanq": "Monabanq est une banque en ligne française qui propose des comptes courants et des cartes de paiement.",
    "Wise": "Wise (anciennement TransferWise) est un service de transfert d'argent international à faible coût.",
    "PayPal": "PayPal est un service de paiement en ligne qui permet d'envoyer et de recevoir de l'argent de manière sécurisée.",
    "Airbnb": "Airbnb est une plateforme de location de logements entre particuliers dans le monde entier.",
    "TotalEnergies": "TotalEnergies est un majeur de l'énergie qui propose des contrats d'électricité et de gaz pour les particuliers.",
    "Engie": "Engie est un fournisseur d'énergie qui propose des contrats d'électricité et de gaz naturel.",
    "EDF": "EDF est le principal fournisseur d'électricité en France, proposant divers contrats pour les particuliers.",
    "Primeo Energie": "Primeo Energie est un fournisseur d'électricité et de gaz qui propose des tarifs compétitifs.",
    "Hello Watt": "Hello Watt est un comparateur et fournisseur d'énergie qui aide à réduire sa facture d'électricité.",
    "Liberté Watts": "Liberté Watts est un fournisseur d'électricité qui propose des offres 100% renouvelables.",
    "Reevolt": "Reevolt est un fournisseur d'électricité qui propose des offres simples et transparentes.",
    "HoneyGain": "HoneyGain est une application qui permet de monétiser sa connexion internet en partageant sa bande passante.",
    "WeWard": "WeWard est une application qui récompense la marche avec des points convertibles en argent.",
    "AttaPoll": "AttaPoll est une application de sondages rémunérés qui permet de gagner de l'argent en répondant à des questionnaires.",
    "BeMyEye": "BeMyEye est une application qui rémunère les utilisateurs pour réaliser des missions mystère.",
    "Fizzer": "Fizzer est une application qui permet de créer et d'envoyer des cartes postales personnalisées.",
    "Hostinger": "Hostinger est un fournisseur d'hébergement web qui propose des services d'enregistrement de domaines et de serveurs.",
    "Kraken": "Kraken est une plateforme d'échange de crypto-monnaies réputée pour sa sécurité.",
    "OKX": "OKX est une plateforme de crypto-monnaies qui propose des services de trading et d'investissement.",
    "Bybit": "Bybit est une plateforme de trading de crypto-monnaies spécialisée dans les contrats à terme.",
    "Bitpanda": "Bitpanda est une plateforme d'investissement en ligne basée en Autriche.",
    "Bitstack": "Bitstack est une application française d'investissement dans le Bitcoin avec des DCA (Dollar Cost Averaging).",
    "Coinhouse": "Coinhouse est une plateforme française d'achat et de vente de crypto-monnaies.",
    "Bricks": "Bricks est une plateforme d'investissement dans l'immobilier divisé.",
    "Raizers": "Raizers est une plateforme de crowdfunding immobilier qui permet d'investir dans des projets.",
    "Bienprêter": "Bienprêter est une plateforme de prêt entre particuliers.",
    "Epargnoo": "Epargnoo est un courtier en ligne qui propose des services d'investissement.",
    "Sumeria": "Sumeria est une banque en ligne qui propose des comptes et des services d'épargne.",
    "Meilleurtaux.com": "Meilleurtaux.com est un comparateur de crédits immobiliers et à la consommation.",
    "assurancevie.com": "assurancevie.com est un courtier en assurance-vie qui propose des contrats d'investissement.",
    "Klarna": "Klarna est un service de paiement fractionné qui permet d'acheter maintenant et payer plus tard.",
    "SumUp": "SumUp est un service de paiement mobile pour les commerçants et petites entreprises.",
    "C-MonEtiquette": "C-MonEtiquette est une plateforme de fidélisation et de parrainage.",
    "Rover": "Rover est une plateforme de garde d'animaux qui met en relation propriétaires et pet-sitters.",
    "Alltricks": "Alltricks est un site de vente d'équipements sportifs en ligne.",
    "Instant Gaming": "Instant Gaming est un site de vente de jeux vidéo à prix réduits.",
    "Fiverr": "Fiverr est une plateforme de freelances qui propose des services à partir de 5 euros.",
    "Systeme.io": "Systeme.io est une plateforme de marketing en ligne tout-en-un.",
    "Joybuy": "Joybuy est une marketplace en ligne pour l'achat de produits divers.",
    "Aroma-Zone": "Aroma-Zone est un site de vente d'ingrédients et de matériel pour la fabrication cosmétique.",
    "Nutripure": "Nutripure est une marque de compléments alimentaires et de nutrition sportive.",
    "Myprotein": "Myprotein : nutrition sportive avec 15 € de remise dès 40 € pour le nouveau client, code à saisir au panier.",
    "Myvitamins": "Myvitamins est un site de vente de vitamines et de compléments alimentaires.",
    "The Protein Works": "The Protein Works est une marque de nutrition sportive britannique.",
    "i-Run": "i-Run est un site de vente d'équipements de course à pied et de sport.",
    "Speedo": "Speedo est une marque d'équipements de natation et de sport aquatique.",
    "Private Sport Shop": "Private Sport Shop est un site de vente d'équipements sportifs en ligne.",
    "Beebs": "Beebs est une plateforme de shopping en ligne.",
    "Wanteeed": "Wanteeed est une plateforme de cashback et de shopping en ligne.",
    "Naomi": "Naomi est une plateforme de shopping et de cashback.",
    "Lalalab": "Lalalab est une application qui permet d'imprimer ses photos depuis son smartphone.",
    "Shoes.fr": "Shoes.fr est un site de vente de chaussures en ligne.",
    "PlacesDesCartes": "PlacesDesCartes est un site de vente de cartes cadeaux.",
    "Cartouche du toner": "Cartouche du toner est un site de vente de consommables d'impression.",
    "Becquet": "Becquet est un site de vente de produits pour la maison.",
    "Biogents": "Biogents est une marque de produits anti-moustiques.",
    "Ritmic": "Ritmic est une marque de vélos électriques et de mobilité urbaine.",
    "ZeConfiserie": "ZeConfiserie est un site de vente de confiseries en ligne.",
    "Simplis": "Simplis est un service d'assurance et de protection juridique.",
    "Caisse d'Épargne Loire-Centre": "La Caisse d'Épargne est une banque coopérative française proposant une gamme complète de services bancaires.",
    "Crédit Agricole Centre Loire": "Le Crédit Agricole est une banque coopérative française qui propose des services bancaires aux particuliers et aux agriculteurs.",
    "GMF": "GMF est une compagnie d'assurance spécialisée dans les assurances de personnes et de biens.",
    "Direct Assurance": "Direct Assurance est une compagnie d'assurance en ligne proposant des assurances auto, habitation et complémentaire santé.",
    "L'Olivier Assurance": "L'Olivier Assurance est une compagnie d'assurance spécialisée dans les assurances auto et habitation.",
    "Parions Sport": "Parions Sport est le site de paris sportifs de FDJ (Française des Jeux).",
    "FDJ": "FDJ (Française des Jeux) est l'opérateur étatique français de jeux de hasard et de paris sportifs.",
    "Betsson": "Betsson est un site de paris sportifs et de jeux de casino en ligne.",
    "Scrambly": "Scrambly est une application qui permet de gagner de l'argent en jouant à des jeux.",
    "Freecash": "Freecash : jeux et tâches rémunérés, jusqu'à 11 € de récompenses pour le parrain réparties en deux paliers.",
    "FidMe": "FidMe est une application qui regroupe toutes ses cartes de fidélité au même endroit.",
    "FeaturePoints": "FeaturePoints est une application qui récompense les utilisateurs pour tester des applications.",
    "Swagbucks": "Swagbucks : sondages, achats et activités rémunérés en SB, avec 10 % des gains éligibles reversés au parrain.",
    "Weward": "WeWard est une application qui récompense la marche avec des points convertibles en argent.",
    "Macadam": "Macadam est une application de cashback et de récompenses.",
    "La Première Brique": "La Première Brique : immobilier participatif, 1 % au filleul et 2 % au parrain sur le premier investissement.",
    "10 pourcent": "10 pourcent est une plateforme de cashback qui propose des remboursements sur les achats en ligne.",
    "Capital Koala": "Capital Koala est un site de cashback qui propose des remboursements sur les achats en ligne.",
    "La Belle Vie": "La Belle Vie : courses et produits du quotidien livrés à domicile, avec une réduction sur la première commande selon la campagne.",
    "Too Good To Go": "Too Good To Go est une application qui permet d'acheter à prix réduit les invendus des commerçants.",
    "Phenix": "Phenix est une application anti-gaspi qui permet d'acheter des produits proches de la date limite.",
    "Pourdebon": "Pourdebon est un site de cashback et de réduction pour les courses en ligne.",
    "La Bourse aux Livres": "La Bourse aux Livres est un site d'achat et de vente de livres d'occasion.",
    "Shein": "Shein est un site de vente de vêtements et d'accessoires de mode à prix bas.",
    "Rakuten": "Rakuten (anciennement PriceMinister) est une marketplace en ligne pour acheter et vendre des produits neufs et d'occasion.",
    "Ward": "Ward est une application de récompenses liée à la marche.",
    "HelloFresh": "HelloFresh est un service de livraison de recettes et ingrédients pour cuisiner à domicile.",
    "Coupon Network": "Coupon Network est un site de coupons de réduction et de cashback.",
    "Greenweez": "Greenweez : boutique en ligne spécialisée en produits bio et sains, 5 € de remise sur une première commande.",
    "SFR": "SFR est un opérateur de téléphonie mobile et d'internet français.",
    "RED by SFR": "RED by SFR est la marque low-cost de l'opérateur SFR proposant des forfaits mobiles à prix réduits.",
    "PMU": "PMU (Pari Mutuel Urbain) est l'opérateur français de paris hippiques.",
    "Choose": "Choose : 10 € de remise dès 50 € d'achat sur une première commande, hors livraison, code à saisir avant le paiement.",
    "KAROS": "KAROS : application de covoiturage pour les trajets du quotidien, 5 € pour le filleul après son premier trajet.",
    "Unibet": "Unibet est un site de paris sportifs en ligne avec freebet de bienvenue et programme de parrainage.",
    "Zumub": "Zumub est un site de vente de compléments alimentaires et de nutrition sportive.",
    "Ludocortex": "Ludocortex est un site de vente de jeux et jouets éducatifs.",
    "Cointiply": "Cointiply est une plateforme de récompenses en crypto-monnaies.",
    "etoro": "eToro est une plateforme de trading social et d'investissement en ligne.",
    "Whatnot": "Whatnot est une plateforme de vente en direct par streaming.",
    "Naomi Models": "Naomi Models est une agence de mannequinat.",
    "Credit Agricole Centre Loire": "Le Crédit Agricole est une banque coopérative française qui propose des services bancaires aux particuliers et aux agriculteurs.",
  };

  return descriptions[name] || `${name} est un service dans le domaine ${category}.`;
}

export const offers: Offer[] = [
  createOffer("boursobank", "BoursoBank", "Banque", "Jusqu'à 150 €", "B"),
  createOffer("igraal", "iGraal", "Cashback", "5 €", "I"),
  createOffer("totalenergies", "TotalEnergies", "Énergie", "50 €", "T"),
  createOffer("sfr", "RED by SFR", "Téléphonie & Internet", "Jusqu'à 15 €", "R"),
  {
    ...createOffer("fortuneo", "Fortuneo", "Banque", "Jusqu'à 150 €", "F"),
    referralCode: "14241677",
  },
  createOffer("poulpeo", "Poulpeo", "Cashback", "5 €", "P"),
  createOffer("paypal", "PayPal", "Banque", "10 €", "P"),
  createOffer("revolut", "Revolut", "Banque", "Aucun avantage filleul annoncé", "R"),
  createOffer("ebuyclub", "eBuyClub", "Cashback", "3 €", "E"),
  createOffer("airbnb", "Airbnb", "Voyage", "Voir l'offre", "A"),
  createOffer("shopmium", "Shopmium", "Courses", "2 €", "S"),
  createOffer("showroomprive", "Showroomprivé", "Shopping", "Voir l'offre", "S"),
  createOffer("hello-bank", "Hello Bank", "Banque", "Jusqu'à 80 €", "H"),
  createOffer("trade-republic", "Trade Republic", "Investissement", "10 € en action", "T"),
  createOffer("rakuten-priceminister", "Rakuten", "Shopping", "10 €", "R"),
  createOffer("direct-assurance", "Direct Assurance", "Assurance", "50 €", "D"),
  createOffer("winamax", "Winamax", "Jeux & paris", "Voir l'offre", "W"),
  createOffer("weward", "WeWard", "Récompenses", "50 Wards", "W"),
  createOffer("n26", "N26", "Banque", "Jusqu'à 75 €", "N"),
  createOffer("coinbase", "Coinbase", "Crypto", "40 € en bitcoin", "C"),
  createOffer("betclic", "Betclic", "Jeux & paris", "Voir l'offre", "B"),
  createOffer("lolivier", "L'Olivier Assurance", "Assurance auto", "50 € auto / 20 € habitation", "L"),
  createOffer("crypto-com", "Crypto.com", "Crypto", "Jusqu'à 90 €", "C"),
  createOffer("primeo-energie", "Primeo Energie", "Énergie", "15 €", "P"),
  createOffer("unibet", "Unibet", "Jeux & paris", "Voir l'offre", "U"),
  createOffer("widilo", "Widilo", "Cashback", "5 €", "W"),
  createOffer("thefork", "TheFork", "Restaurants", "Voir l'offre", "T"),
  createOffer("linxea", "Linxea", "Épargne & assurance-vie", "Voir l'offre", "L"),
  createOffer("bricks", "Bricks", "Investissement", "Voir l'offre", "B"),
  createOffer("swissborg", "SwissBorg", "Crypto", "Voir l'offre", "S"),
  createOffer("airbnb-1", "Airbnb Hôtes", "Voyage", "Voir l'offre", "A"),
  createOffer("choose", "Choose", "Shopping", "Voir l'offre", "C"),
  createOffer("myprotein", "Myprotein", "Sport & nutrition", "Voir l'offre", "M"),
  createOffer("hello-fresh", "HelloFresh", "Courses", "Voir l'offre", "H"),
  createOffer("pmu", "PMU", "Jeux & paris", "Voir l'offre", "P"),
  createOffer("coupon-network", "Coupon Network", "Courses", "Voir l'offre", "C"),
  createOffer("engie", "Engie", "Énergie", "Jusqu'à 25 €", "E"),
  createOffer("la-premiere-brique-1", "La Première Brique", "Investissement", "Voir l'offre", "L"),
  createOffer("macadam-4", "Macadam", "Récompenses", "Voir l'offre", "M"),
  createOffer("wise", "Wise", "Banque & transferts", "1er transfert offert jusqu'à 500 €", "W"),
  createOffer("aroma-zone", "Aroma-Zone", "Shopping", "Voir l'offre", "A"),
  createOffer("wanteeed", "Wanteeed", "Cashback", "Voir l'offre", "W"),
  createOffer("naomi-1", "Naomi", "Cashback", "Voir l'offre", "N"),
  createOffer("bienpreter", "Bienprêter", "Investissement", "Voir l'offre", "B"),
  createOffer("phenix", "Phenix", "Courses & anti-gaspi", "Voir l'offre", "P"),
  createOffer("attapoll", "AttaPoll", "Récompenses", "Voir l'offre", "A"),
  createOffer("greenweez-6", "Greenweez", "Shopping", "Voir l'offre", "G"),
  createOffer("fizzer", "Fizzer", "Shopping", "Voir l'offre", "F"),
  createOffer("swagbucks", "Swagbucks", "Récompenses", "Voir l'offre", "S"),
  createOffer("honeygain", "HoneyGain", "Récompenses", "Voir l'offre", "H"),
  createOffer("monabanq", "Monabanq", "Banque", "Jusqu'à 200 €", "M"),
  createOffer("parions-sport", "Parions Sport", "Jeux & paris", "Voir l'offre", "P"),
  createOffer("topcashback", "TopCashback", "Cashback", "Voir l'offre", "T"),
  createOffer("etoro", "etoro", "Investissement", "Aucun avantage filleul annoncé en France", "E"),
  createOffer("private-sport-shop", "Private Sport Shop", "Sport & shopping", "Voir l'offre", "P"),
  createOffer("bitstack", "Bitstack", "Crypto", "5 € en Bitcoin", "B"),
  createOffer("instant-gaming", "Instant Gaming", "Gaming", "Voir l'offre", "I"),
  createOffer("shein", "Shein", "Shopping", "Voir l'offre", "S"),
  createOffer("gmf", "GMF", "Assurance", "50 €", "G"),
  createOffer("karos", "KAROS", "Mobilité", "Voir l'offre", "K"),
  createOffer("kraken", "Kraken", "Crypto", "20 à 200 € en BTC", "K"),
  createOffer("capital-koala", "Capital Koala", "Cashback", "Voir l'offre", "C"),
  createOffer("freecash", "Freecash", "Récompenses", "Voir l'offre", "F"),
  createOffer("beebs", "Beebs", "Shopping", "Voir l'offre", "B"),
  createOffer("hello-watt", "Hello Watt", "Énergie", "Voir l'offre", "H"),
  createOffer("bemyeye", "BeMyEye", "Récompenses", "Voir l'offre", "B"),
  createOffer("i-run-fr", "i-Run", "Sport", "Voir l'offre", "I"),
  createOffer("bitpanda", "Bitpanda", "Crypto", "Voir l'offre", "B"),
  createOffer("bebe-boutik", "Bébé Boutik", "Bébé", "Voir l'offre", "B"),
  createOffer("bybit", "Bybit", "Crypto", "Voir l'offre", "B"),
  createOffer("fdj-francaise-des-jeux", "FDJ", "Jeux & paris", "Voir l'offre", "F"),
  createOffer("lalalab", "Lalalab", "Shopping", "Voir l'offre", "L"),
  createOffer("sumeria", "Sumeria", "Banque", "Jusqu'à 30 €", "S"),
  createOffer("meilleurtaux-com", "Meilleurtaux.com", "Finance", "Voir l'offre", "M"),
  createOffer("assurancevie-com", "assurancevie.com", "Épargne & assurance-vie", "Voir l'offre", "A"),
  createOffer("edf", "EDF", "Énergie", "40 €", "E"),
  createOffer("hostinger", "Hostinger", "Web & numérique", "Voir l'offre", "H"),
  createOffer("whatnot", "Whatnot", "Shopping", "Voir l'offre", "W"),
  createOffer("too-good-to-go", "Too Good To Go", "Courses & anti-gaspi", "Voir l'offre", "T"),
  createOffer("placesdescartes", "PlacesDesCartes", "Shopping", "Voir l'offre", "P"),
  createOffer("sumup", "SumUp", "Pro & finance", "Voir l'offre", "S"),
  createOffer("fidme", "FidMe", "Récompenses", "Voir l'offre", "F"),
  createOffer("la-belle-vie", "La Belle Vie", "Courses", "Voir l'offre", "L"),
  createOffer("cointiply", "Cointiply", "Crypto", "Voir l'offre", "C"),
  createOffer("fiverr", "Fiverr", "Services", "Voir l'offre", "F"),
  createOffer("okx", "OKX", "Crypto", "Voir l'offre", "O"),
  createOffer("revolut-business", "Revolut Business", "Pro & finance", "Voir l'offre", "R"),
  createOffer("raizers", "Raizers", "Investissement", "Voir l'offre", "R"),
  createOffer("nutripure", "Nutripure", "Sport & nutrition", "Voir l'offre", "N"),
  createOffer("pourdebon", "Pourdebon", "Courses", "Voir l'offre", "P"),
  createOffer("10-pourcent-1", "10 pourcent", "Cashback", "Voir l'offre", "10"),
  createOffer("becquet", "Becquet", "Maison", "Voir l'offre", "B"),
  createOffer("c-monetiquette", "C-MonEtiquette", "Maison & shopping", "Voir l'offre", "C"),
  createOffer("betsson", "Betsson", "Jeux & paris", "Voir l'offre", "B"),
  createOffer("systeme-io", "Systeme.io", "Web & numérique", "Voir l'offre", "S"),
  createOffer("liberte-watts", "Liberté Watts", "Énergie", "Voir l'offre", "L"),
  createOffer("klarna", "Klarna", "Finance & shopping", "Voir l'offre", "K"),
  createOffer("reevolt", "Reevolt", "Énergie", "Voir l'offre", "R"),
  createOffer("scrambly", "Scrambly", "Récompenses", "Voir l'offre", "S"),
  createOffer("splint-invest", "Splint Invest", "Investissement", "Voir l'offre", "S"),
  createOffer("rover-1", "Rover", "Animaux", "Voir l'offre", "R"),
  createOffer("alltricks", "Alltricks", "Sport", "Voir l'offre", "A"),
  createOffer("featurepoints", "FeaturePoints", "Récompenses", "Voir l'offre", "F"),
  createOffer("joybuy", "Joybuy", "Shopping", "Voir l'offre", "J"),
  createOffer("the-protein-works", "The Protein Works", "Sport & nutrition", "Voir l'offre", "T"),
  createOffer("shoes-fr", "Shoes.fr", "Mode & shopping", "Voir l'offre", "S"),
  createOffer("epargnoo-5", "Epargnoo", "Finance", "Voir l'offre", "E"),
  createOffer("caisse-depargne-loire-centre", "Caisse d'Épargne Loire-Centre", "Banque", "Voir l'offre", "C"),
  createOffer("la-bourse-aux-livres", "La Bourse aux Livres", "Shopping", "Voir l'offre", "L"),
  createOffer("cartouche-du-toner", "Cartouche du toner", "Shopping", "Voir l'offre", "C"),
  createOffer("myvitamins", "Myvitamins", "Sport & nutrition", "Voir l'offre", "M"),
  createOffer("zumub", "Zumub", "Sport & nutrition", "Voir l'offre", "Z"),
  createOffer("speedo", "Speedo", "Sport", "Voir l'offre", "S"),
  createOffer("coinhouse", "Coinhouse", "Crypto", "Voir l'offre", "C"),
  createOffer("ludocortex", "Ludocortex", "Jeux & loisirs", "Voir l'offre", "L"),
  createOffer("biogents", "Biogents", "Maison", "Voir l'offre", "B"),
  createOffer("credit-agricole-centre-loire", "Crédit Agricole Centre Loire", "Banque", "Voir l'offre", "C"),
  createOffer("ritmic", "Ritmic", "Mobilité", "Voir l'offre", "R"),
  createOffer("zeconfiserie", "ZeConfiserie", "Alimentation", "Voir l'offre", "Z"),
  createOffer("simplis", "Simplis", "Pro & assurance", "Voir l'offre", "S"),
];

export function getOffer(slug: string) {
  return offers.find((offer) => offer.slug === slug);
}

import { getSafeReferralUrl } from "@/lib/referralSafety";

export function getOfferReferralUrl(offer: Offer) {
  return getSafeReferralUrl(offer.referralLink);
}

export function getPotentialGain(offer: Offer) {
  return offer.bonus;
}

export function getReverseAmount(offer: Offer) {
  return offer.parrainioReward ?? "Non communiqué";
}

// Featured offers configuration - client side default
export { SELECTION_DU_MOMENT } from "./featuredOffersConfig";
import { SELECTION_DU_MOMENT } from "./featuredOffersConfig";

export const defaultFeaturedOfferSlugs: string[] = [...SELECTION_DU_MOMENT];

export function getFeaturedOffers(slugs: string[] = defaultFeaturedOfferSlugs): Offer[] {
  return slugs
    .map(slug => offers.find(offer => offer.slug === slug))
    .filter((offer): offer is Offer => offer !== undefined);
}