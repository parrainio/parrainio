export type EsimPromoCode = {
  slug: string;
  name: string;
  code: string;
  discountPercent: number;
  color: string;
  logo: string;
  description: string;
  packageModel: string;
  coverage: string;
  dataAllowance: string;
  validity: string;
  price: string;
  conditions: string;
  officialUrl: string;
};

export const esimPromoCodes = [
  {
    slug: "saily",
    name: "Saily",
    code: "Edcom15",
    discountPercent: 15,
    color: "#5937a5",
    logo: "/logos/saily.png",
    description:
      "Une application pour acheter et gérer une eSIM de voyage et un forfait de données avant le départ.",
    packageModel: "Forfaits de données eSIM gérés depuis l’application.",
    coverage: "À vérifier pour la destination et le forfait choisis.",
    dataAllowance: "Quota et éventuelles limites à vérifier sur l’offre.",
    validity: "À vérifier selon le forfait.",
    price: "Non comparé : tarif actuel non vérifié.",
    conditions: "Compatibilité, activation et conditions du forfait à vérifier auprès de Saily.",
    officialUrl: "https://saily.com/",
  },
  {
    slug: "ubigi",
    name: "Ubigi",
    code: "UBIMOVE10",
    discountPercent: 10,
    color: "#e34a4a",
    logo: "/logos/ubigi.svg",
    description:
      "Des forfaits de données mobiles via eSIM, proposés pour smartphones, tablettes, ordinateurs et véhicules connectés.",
    packageModel: "Forfaits de données mobiles via eSIM.",
    coverage: "À vérifier pour la destination et le forfait choisis.",
    dataAllowance: "Quota à vérifier sur l’offre sélectionnée.",
    validity: "À vérifier selon le forfait.",
    price: "Non comparé : tarif actuel non vérifié.",
    conditions: "Appareils compatibles et conditions à vérifier auprès d’Ubigi.",
    officialUrl: "https://www.ubigi.com/",
  },
  {
    slug: "airalo",
    name: "Airalo",
    code: "BIENVENUE30",
    discountPercent: 30,
    color: "#2c7d91",
    logo: "/logos/airalo.png",
    description:
      "Une boutique d’eSIM de voyage avec des forfaits locaux, régionaux ou mondiaux pour préparer une connexion à l’étranger.",
    packageModel: "Forfaits locaux, régionaux et mondiaux.",
    coverage: "Le site annonce des offres dans plus de 200 destinations ; disponibilité selon le forfait.",
    dataAllowance: "Volumes et éventuelles limites à comparer pour chaque forfait.",
    validity: "À vérifier selon le forfait.",
    price: "Non comparé : tarif actuel non vérifié.",
    conditions: "Destination, compatibilité et conditions d’activation à vérifier auprès d’Airalo.",
    officialUrl: "https://www.airalo.com/",
  },
  {
    slug: "esimo",
    name: "Esimo",
    code: "BEMOVE",
    discountPercent: 15,
    color: "#463b8e",
    logo: "/logos/esimo.webp",
    description:
      "Une application eSIM de voyage pour suivre sa consommation et recharger son forfait depuis le téléphone.",
    packageModel: "Forfaits eSIM gérés dans l’application ; options et services selon l’offre.",
    coverage: "À vérifier pour la destination et le forfait choisis.",
    dataAllowance: "Quota et éventuelles limites à vérifier sur l’offre.",
    validity: "À vérifier selon le forfait.",
    price: "Non comparé : tarif actuel non vérifié.",
    conditions: "Compatibilité, activation et conditions à vérifier auprès d’Esimo.",
    officialUrl: "https://esimo.io/",
  },
  {
    slug: "holafly",
    name: "Holafly",
    code: "BEMOVE",
    discountPercent: 5,
    color: "#26745c",
    logo: "/logos/holafly.svg",
    description:
      "Des eSIM de voyage avec forfaits de données annoncés comme illimités ; vérifiez la destination et les conditions d’usage.",
    packageModel: "Forfaits eSIM de voyage ; des options avec données illimitées sont annoncées.",
    coverage: "Le site annonce plus de 200 destinations ; offre à confirmer pour le pays choisi.",
    dataAllowance: "Données illimitées annoncées sur certains forfaits ; vérifier les conditions d’usage.",
    validity: "À vérifier selon le forfait et le nombre de jours choisi.",
    price: "Non comparé : tarif actuel non vérifié.",
    conditions: "Destination, durée, compatibilité et conditions d’usage à vérifier auprès de Holafly.",
    officialUrl: "https://esim.holafly.com/",
  },
] as const satisfies readonly EsimPromoCode[];
