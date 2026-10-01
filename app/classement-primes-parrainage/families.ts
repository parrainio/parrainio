/**
 * Familles utilisateur du classement — source partagée entre la page (calcul
 * serveur de la section « par catégorie ») et RankingTable (filtre client).
 * LOGIQUE D'AFFICHAGE UNIQUEMENT : les 29 catégories sous-jacentes des offres
 * restent strictement inchangées ; la correspondance est insensible à la casse
 * (« sondage » comme « Sondage »).
 */
export const FAMILY_CATEGORIES: { label: string; categories: string[] }[] = [
  {
    label: "Banque & assurance",
    categories: ["banque", "assurance", "assurance auto", "finance", "pro & finance", "pro & assurance"],
  },
  {
    label: "Investissement & crypto",
    categories: ["crypto", "investissement", "épargne & assurance-vie"],
  },
  {
    label: "Cashback & récompenses",
    categories: ["cashback", "récompenses", "sondage"],
  },
  {
    label: "Shopping & maison",
    categories: ["shopping", "mode & shopping", "maison", "maison & shopping", "bébé", "animaux", "finance & shopping"],
  },
  {
    label: "Sport & nutrition",
    categories: ["sport", "sport & nutrition", "sport & shopping"],
  },
  {
    label: "Courses & restaurants",
    categories: ["courses", "courses & anti-gaspi", "restaurants"],
  },
  { label: "Jeux & paris", categories: ["jeux & paris"] },
  { label: "Énergie", categories: ["énergie"] },
  { label: "Mobilité", categories: ["mobilité"] },
];

export const norm = (value: string) => value.trim().toLowerCase();
