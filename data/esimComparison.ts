export type EsimDestination = "united-states" | "japan" | "thailand";

export const esimDestinations: {
  id: EsimDestination;
  label: string;
}[] = [
  { id: "united-states", label: "États-Unis" },
  { id: "japan", label: "Japon" },
  { id: "thailand", label: "Thaïlande" },
];

export type FixedPlanComparison = {
  slug: string;
  package: string;
  price: string | null;
  note: string;
  sourceUrl: string;
};

export const fixedPlanComparisons: Record<EsimDestination, FixedPlanComparison[]> = {
  "united-states": [
    {
      slug: "ubigi",
      package: "10 Go · 30 jours",
      price: "14 €",
      note: "Forfait de données ponctuel. Smartstart démarre à l’arrivée ; recharge et partage de connexion disponibles.",
      sourceUrl:
        "https://cellulardata.ubigi.com/rates-and-coverage/usa-data-plans/usa-10gb-30-days/?currency=EUR",
    },
    {
      slug: "airalo",
      package: "10 Go · 30 jours",
      price: "21 €",
      note: "Réseau principal affiché : T-Mobile. Recharge possible lorsque l’option est proposée pour l’eSIM.",
      sourceUrl: "https://www.airalo.com/fr/united-states-esim/change-in-30days-10gb",
    },
    {
      slug: "saily",
      package: "Référence visée : 10 Go · 30 jours",
      price: null,
      note: "Tarif non confirmé : la page officielle a renvoyé une erreur 403 lors du contrôle.",
      sourceUrl: "https://saily.com/fr/esim-united-states/",
    },
    {
      slug: "esimo",
      package: "Offre fixe à sélectionner",
      price: null,
      note: "Le sélecteur officiel de forfaits n’a pas permis de confirmer une offre précise ni son prix.",
      sourceUrl: "https://esimo.io/",
    },
    {
      slug: "holafly",
      package: "Forfait annoncé illimité",
      price: null,
      note: "Comparé séparément dans l’onglet « Illimité » ; ne correspond pas à un forfait fixe de 10 Go.",
      sourceUrl: "https://esim.holafly.com/fr/esim-usa/",
    },
  ],
  japan: [
    {
      slug: "ubigi",
      package: "10 Go · 30 jours",
      price: "16,50 €",
      note: "Forfait de données ponctuel. Smartstart démarre à l’arrivée ; recharge et partage de connexion disponibles.",
      sourceUrl:
        "https://cellulardata.ubigi.com/rates-and-coverage/japan-data-plans/japan-10gb-30-days/?currency=EUR",
    },
    {
      slug: "airalo",
      package: "10 Go · 30 jours",
      price: "17 €",
      note: "Réseau principal affiché : SoftBank. Recharge possible lorsque l’option est proposée pour l’eSIM.",
      sourceUrl: "https://www.airalo.com/fr/japan-esim/moshi-moshi-30days-10gb",
    },
    {
      slug: "saily",
      package: "Référence visée : 10 Go · 30 jours",
      price: null,
      note: "Tarif non confirmé : la page officielle a renvoyé une erreur 403 lors du contrôle.",
      sourceUrl: "https://saily.com/fr/esim-japan/",
    },
    {
      slug: "esimo",
      package: "Offre fixe à sélectionner",
      price: null,
      note: "Le sélecteur officiel de forfaits n’a pas permis de confirmer une offre précise ni son prix.",
      sourceUrl: "https://esimo.io/",
    },
    {
      slug: "holafly",
      package: "Forfait annoncé illimité",
      price: null,
      note: "Comparé séparément dans l’onglet « Illimité » ; ne correspond pas à un forfait fixe de 10 Go.",
      sourceUrl: "https://esim.holafly.com/fr/",
    },
  ],
  thailand: [
    {
      slug: "ubigi",
      package: "10 Go · 30 jours",
      price: "11 €",
      note: "Forfait de données ponctuel. Smartstart démarre à l’arrivée ; recharge et partage de connexion disponibles.",
      sourceUrl:
        "https://cellulardata.ubigi.com/rates-and-coverage/thailand-data-plans/thailand-10gb-30-days/?currency=EUR",
    },
    {
      slug: "airalo",
      package: "10 Go · 30 jours",
      price: "10,50 €",
      note: "Réseau principal affiché : dtac. Recharge possible lorsque l’option est proposée pour l’eSIM.",
      sourceUrl: "https://www.airalo.com/fr/thailand-esim/maew-in-30days-10gb",
    },
    {
      slug: "saily",
      package: "Référence visée : 10 Go · 30 jours",
      price: null,
      note: "Tarif non confirmé : la page officielle a renvoyé une erreur 403 lors du contrôle.",
      sourceUrl: "https://saily.com/fr/esim-thailand/",
    },
    {
      slug: "esimo",
      package: "Offre fixe à sélectionner",
      price: null,
      note: "Le sélecteur officiel de forfaits n’a pas permis de confirmer une offre précise ni son prix.",
      sourceUrl: "https://esimo.io/",
    },
    {
      slug: "holafly",
      package: "Forfait annoncé illimité",
      price: null,
      note: "Comparé séparément dans l’onglet « Illimité » ; ne correspond pas à un forfait fixe de 10 Go.",
      sourceUrl: "https://esim.holafly.com/fr/",
    },
  ],
};

export const unlimitedPlanNotes: {
  slug: string;
  note: (destination: EsimDestination) => string;
  sourceUrl: (destination: EsimDestination) => string;
}[] = [
  {
    slug: "holafly",
    note: (destination) =>
      destination === "united-states"
        ? "États-Unis : 46,90 € pour 15 jours ou 68,90 € pour 30 jours. Le partage de connexion est inclus avec un volume dépendant de la durée (exemple publié : 7 Go pour 7 jours)."
        : "Forfait illimité annoncé ; le prix et les durées pour cette destination n’ont pas été confirmés lors de ce contrôle.",
    sourceUrl: (destination) =>
      destination === "united-states"
        ? "https://esim.holafly.com/fr/esim-usa/"
        : "https://esim.holafly.com/fr/",
  },
  {
    slug: "airalo",
    note: () =>
      "Le catalogue officiel comporte une catégorie de forfaits illimités ; prix, durée et conditions propres à cette destination non relevés ici.",
    sourceUrl: (destination) => {
      if (destination === "japan") {
        return "https://www.airalo.com/japan-esim/moshi-moshi-30days-10gb";
      }
      if (destination === "thailand") {
        return "https://www.airalo.com/thailand-esim/maew-in-30days-5gb";
      }
      return "https://www.airalo.com/united-states-esim/change-in-30days-5gb";
    },
  },
  {
    slug: "esimo",
    note: () =>
      "Des forfaits illimités sont présentés sur le site officiel ; le sélecteur n’a pas permis de confirmer leur prix, leur durée ou leur disponibilité pour cette destination.",
    sourceUrl: () => "https://esimo.io/",
  },
];

export const providerComparisonNotes: {
  slug: string;
  strength: string;
  limit: string;
  suitableFor: string;
}[] = [
  {
    slug: "saily",
    strength:
      "Le code Edcom15 et la réduction annoncée de 15 % figurent dans les données partenaire Bemove.",
    limit:
      "La page tarifaire officielle a renvoyé une erreur 403 pendant ce contrôle ; les prix, les options et les conditions du forfait n’ont donc pas pu être vérifiés.",
    suitableFor:
      "À envisager après vérification de la destination, du volume, de la durée et du prix dans le parcours officiel.",
  },
  {
    slug: "ubigi",
    strength:
      "Des forfaits fixes de 10 Go / 30 jours sont affichés pour les trois destinations de référence ; Smartstart, recharge et partage de données sont indiqués.",
    limit:
      "Les tarifs vérifiés sont affichés en euros ; la couverture exacte et le prix au paiement restent à confirmer pour le pays et l’appareil concernés.",
    suitableFor:
      "Un séjour d’un mois avec quota défini, si l’offre et la devise conviennent.",
  },
  {
    slug: "airalo",
    strength:
      "Des forfaits fixes de 10 Go / 30 jours sont affichés pour les trois destinations ; les pages indiquent respectivement T-Mobile, SoftBank et dtac comme réseaux principaux.",
    limit:
      "Les prix vérifiés sont affichés en euros. Les recharges dépendent du forfait ; elles ne sont pas proposées pour toutes les eSIM.",
    suitableFor:
      "Comparer des forfaits locaux et consulter le réseau principal annoncé pour chaque destination.",
  },
  {
    slug: "esimo",
    strength:
      "Le site officiel présente le suivi de consommation et la recharge dans l’application, le partage de connexion, la 4G/5G et des offres illimitées.",
    limit:
      "Le sélecteur de forfait n’a pas permis de relever un prix exact, une durée ni une offre précise pour les destinations comparées.",
    suitableFor:
      "Les voyageurs qui souhaitent gérer leur consommation et leurs recharges depuis l’application, sous réserve de confirmer le forfait choisi.",
  },
  {
    slug: "holafly",
    strength:
      "Des forfaits illimités États-Unis sont affichés à 46,90 € / 15 jours et 68,90 € / 30 jours ; la page indique une activation à destination.",
    limit:
      "Le partage de connexion est limité par une enveloppe dépendant de la durée (la page donne l’exemple de 7 Go pour 7 jours). Les tarifs des autres destinations n’ont pas été relevés.",
    suitableFor:
      "Les voyageurs qui privilégient une enveloppe de données annoncée illimitée sur un séjour aux États-Unis, avec un usage du partage de connexion modéré.",
  },
];
