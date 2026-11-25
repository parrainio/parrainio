export type ParcoursStep = {
  number: number;
  name: string;
  subtitle?: string;
  offerSlug: string | null;
  deposit: string;
  reward: string;
  netReward?: string;
  rewardBreakdown?: string;
  delay: string;
  cumulativeDelay: string;
  cumulativeGain: string;
  amount: number;
  cumulativeAmount: number;
  depositAmount: number;
};

export type ParrainioParcours = {
  key: "a" | "b";
  title: string;
  shortTitle: string;
  href: "/parcours-a" | "/parcours-b";
  image: string;
  imageAlt: string;
  summary: string;
  total: string;
  earlyTotal: string;
  earlyDelay: string;
  totalDelay: string;
  steps: ParcoursStep[];
};

export const PARCOURS_A: ParrainioParcours = {
  key: "a",
  title: "Parcours A – Le parcours classique",
  shortTitle: "Parcours A",
  href: "/parcours-a",
  image: "/parcours/parcours-a-1017-50.png",
  imageAlt: "Infographie du parcours classique de 0 € à 1 017,50 € de primes cumulées",
  summary:
    "Un premier chemin qui commence avec Hello bank! et atteint 397,50 € après sept étapes, avant de continuer jusqu'au total illustré de 1 017,50 €.",
  total: "1 017,50 €",
  earlyTotal: "397,50 €",
  earlyDelay: "57 jours",
  totalDelay: "≈ 267 jours (environ 9 mois)",
  steps: [
    { number: 1, name: "Hello bank!", offerSlug: "hello-bank", deposit: "0 €", reward: "130 €", rewardBreakdown: "80 € partenaire + 50 € Parrainio", delay: "10 jours", cumulativeDelay: "10 jours", cumulativeGain: "130 €", amount: 130, cumulativeAmount: 130, depositAmount: 0 },
    { number: 2, name: "eToro", offerSlug: "etoro", deposit: "100 €", reward: "40 €", delay: "7 jours", cumulativeDelay: "17 jours", cumulativeGain: "170 €", amount: 40, cumulativeAmount: 170, depositAmount: 100 },
    { number: 3, name: "Coinbase", offerSlug: "coinbase", deposit: "20 €", reward: "20 €", rewardBreakdown: "Prime nette, frais compensés", delay: "48 heures", cumulativeDelay: "19 jours", cumulativeGain: "190 €", amount: 20, cumulativeAmount: 190, depositAmount: 20 },
    { number: 4, name: "N26", offerSlug: "n26", deposit: "0 €", reward: "27,50 €", delay: "10 jours", cumulativeDelay: "29 jours", cumulativeGain: "217,50 €", amount: 27.5, cumulativeAmount: 217.5, depositAmount: 0 },
    { number: 5, name: "Kraken", offerSlug: "kraken", deposit: "200 €", reward: "40 €", rewardBreakdown: "30 € partenaire + 10 € Parrainio", delay: "7 jours", cumulativeDelay: "36 jours", cumulativeGain: "257,50 €", amount: 40, cumulativeAmount: 257.5, depositAmount: 200 },
    { number: 6, name: "LCL", offerSlug: null, deposit: "0 €", reward: "70 €", delay: "14 jours", cumulativeDelay: "50 jours", cumulativeGain: "327,50 €", amount: 70, cumulativeAmount: 327.5, depositAmount: 0 },
    { number: 7, name: "Fortuneo", offerSlug: "fortuneo", deposit: "300 €", reward: "70 €", delay: "7 jours", cumulativeDelay: "57 jours", cumulativeGain: "397,50 €", amount: 70, cumulativeAmount: 397.5, depositAmount: 300 },
    { number: 8, name: "Monabanq", offerSlug: "monabanq", deposit: "0 €", reward: "200 €", delay: "1 mois", cumulativeDelay: "≈ 87 jours", cumulativeGain: "597,50 €", amount: 200, cumulativeAmount: 597.5, depositAmount: 0 },
    { number: 9, name: "BoursoBank", offerSlug: "boursobank", deposit: "300 €", reward: "220 €", delay: "15 minutes", cumulativeDelay: "≈ 87 jours", cumulativeGain: "817,50 €", amount: 220, cumulativeAmount: 817.5, depositAmount: 300 },
    { number: 10, name: "L by LCL", subtitle: "Livret +", offerSlug: "l-by-lcl", deposit: "50 €", reward: "100 €", delay: "3 mois", cumulativeDelay: "≈ 177 jours", cumulativeGain: "917,50 €", amount: 100, cumulativeAmount: 917.5, depositAmount: 50 },
    { number: 11, name: "assurancevie.com", offerSlug: "assurancevie-com", deposit: "100 €", reward: "100 €", rewardBreakdown: "50 € partenaire + 50 € Parrainio", delay: "3 mois", cumulativeDelay: "≈ 267 jours", cumulativeGain: "1 017,50 €", amount: 100, cumulativeAmount: 1017.5, depositAmount: 100 },
  ],
};

export const PARCOURS_B: ParrainioParcours = {
  key: "b",
  title: "Parcours B – Le parcours alternatif",
  shortTitle: "Parcours B",
  href: "/parcours-b",
  image: "/parcours/parcours-b-1052-01.png",
  imageAlt: "Infographie du parcours alternatif de 0 € à 1 052,01 € de primes cumulées",
  summary:
    "Une variante avec BNP Paribas, XTB et Revolut, qui atteint 432,01 € nets après huit étapes et affiche 1 052,01 € au terme du parcours.",
  total: "1 052,01 €",
  earlyTotal: "432,01 €",
  earlyDelay: "67 jours",
  totalDelay: "≈ 277 jours (environ 9 mois)",
  steps: [
    { number: 1, name: "BNP Paribas", offerSlug: "bnp", deposit: "0 €", reward: "130 €", rewardBreakdown: "80 € partenaire + 50 € Parrainio.fr", delay: "21 jours", cumulativeDelay: "21 jours", cumulativeGain: "130 €", amount: 130, cumulativeAmount: 130, depositAmount: 0 },
    { number: 2, name: "eToro", offerSlug: "etoro", deposit: "100 €", reward: "40 €", delay: "7 jours", cumulativeDelay: "28 jours", cumulativeGain: "170 €", amount: 40, cumulativeAmount: 170, depositAmount: 100 },
    { number: 3, name: "Coinbase", offerSlug: "coinbase", deposit: "20 €", reward: "20 €", rewardBreakdown: "Prime nette, frais compensés", delay: "48 heures", cumulativeDelay: "30 jours", cumulativeGain: "190 €", amount: 20, cumulativeAmount: 190, depositAmount: 20 },
    { number: 4, name: "XTB", offerSlug: "xtb", deposit: "1 €", reward: "30 €", delay: "3 jours", cumulativeDelay: "33 jours", cumulativeGain: "220 €", amount: 30, cumulativeAmount: 220, depositAmount: 1 },
    { number: 5, name: "Revolut", offerSlug: "revolut", deposit: "7,99 €", reward: "40 €", netReward: "32,01 €", rewardBreakdown: "32,01 € de gain net après frais", delay: "7 jours", cumulativeDelay: "40 jours", cumulativeGain: "252,01 €", amount: 32.01, cumulativeAmount: 252.01, depositAmount: 7.99 },
    { number: 6, name: "Kraken", offerSlug: "kraken", deposit: "200 €", reward: "40 €", rewardBreakdown: "30 € partenaire + 10 € Parrainio.fr", delay: "7 jours", cumulativeDelay: "47 jours", cumulativeGain: "292,01 €", amount: 40, cumulativeAmount: 292.01, depositAmount: 200 },
    { number: 7, name: "LCL", offerSlug: null, deposit: "0 €", reward: "70 €", delay: "14 jours", cumulativeDelay: "61 jours", cumulativeGain: "362,01 €", amount: 70, cumulativeAmount: 362.01, depositAmount: 0 },
    { number: 8, name: "Fortuneo", offerSlug: "fortuneo", deposit: "300 €", reward: "70 €", delay: "7 jours", cumulativeDelay: "67 jours", cumulativeGain: "432,01 €", amount: 70, cumulativeAmount: 432.01, depositAmount: 300 },
    { number: 9, name: "Monabanq", offerSlug: "monabanq", deposit: "0 €", reward: "200 €", delay: "1 mois", cumulativeDelay: "≈ 97 jours", cumulativeGain: "632,01 €", amount: 200, cumulativeAmount: 632.01, depositAmount: 0 },
    { number: 10, name: "BoursoBank", offerSlug: "boursobank", deposit: "300 €", reward: "220 €", delay: "15 minutes", cumulativeDelay: "≈ 97 jours", cumulativeGain: "852,01 €", amount: 220, cumulativeAmount: 852.01, depositAmount: 300 },
    { number: 11, name: "L by LCL", subtitle: "Livret +", offerSlug: "l-by-lcl", deposit: "50 €", reward: "100 €", delay: "3 mois", cumulativeDelay: "≈ 187 jours", cumulativeGain: "952,01 €", amount: 100, cumulativeAmount: 952.01, depositAmount: 50 },
    { number: 12, name: "assurancevie.com", offerSlug: "assurancevie-com", deposit: "100 €", reward: "100 €", rewardBreakdown: "50 € partenaire + 50 € Parrainio.fr", delay: "3 mois", cumulativeDelay: "≈ 277 jours", cumulativeGain: "1 052,01 €", amount: 100, cumulativeAmount: 1052.01, depositAmount: 100 },
  ],
};

export const PARCOURS_LIST = [PARCOURS_A, PARCOURS_B] as const;
