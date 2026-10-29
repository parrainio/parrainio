export type EsimPromoCode = {
  slug: string;
  name: string;
  code: string;
  discountPercent: number;
  color: string;
  logo: string;
};

export const esimPromoCodes = [
  { slug: "saily", name: "Saily", code: "Edcom15", discountPercent: 15, color: "#5937a5", logo: "/logos/saily.png" },
  { slug: "ubigi", name: "Ubigi", code: "UBIMOVE10", discountPercent: 10, color: "#e34a4a", logo: "/logos/ubigi.svg" },
  { slug: "airalo", name: "Airalo", code: "BIENVENUE30", discountPercent: 30, color: "#2c7d91", logo: "/logos/airalo.png" },
  { slug: "esimo", name: "Esimo", code: "BEMOVE", discountPercent: 15, color: "#463b8e", logo: "/logos/esimo.webp" },
  { slug: "holafly", name: "Holafly", code: "BEMOVE", discountPercent: 5, color: "#26745c", logo: "/logos/holafly.svg" },
] as const satisfies readonly EsimPromoCode[];
