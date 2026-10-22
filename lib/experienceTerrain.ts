import raw from "@/data/experience-terrain.json";

/**
 * Retours d'expérience du responsable de Parrainio.
 *
 * Ils ne remplacent jamais une condition officielle : chaque entrée porte sa
 * provenance, sa date et l'écart éventuel avec la page de l'établissement.
 * Les champs sont séparés par étape pour qu'aucun total ne soit calculé en
 * additionnant des durées qui courent en parallèle.
 */

export type PorteeDelai = "les_deux" | "exception";
export type Simultaneite = "simultanee" | "non_simultanee";
export type NatureConservation = "clause_officielle" | "recommendation_terrain" | "non_precisee";
export type NatureReprise =
  | "clause_identifiee"
  | "constatee"
  | "precaution"
  | "non_publiee";
export type Concordance = "concorde" | "ecart" | "non_verifiable";

/** Compléments financiers transmis séparément le même jour que les retours terrain. */
export type TransmissionComplementaire = {
  primeObservee: string;
  reversementObserve: string;
  concordance: Concordance;
  note: string;
};

export type RetourTerrain = {
  slug: string;
  nom: string;
  delais: {
    /** Délai de la prime du filleul, tel que constaté. */
    primeFilleul: string;
    /** Délai de la prime ou commission du parrain, distinct du précédent. */
    commissionParrain: string;
    /** Délai propre à Parrainio, après réception de la commission. */
    reversementParrainio: string;
  };
  /** Formulation courte affichable sur une fiche. */
  delai: { texte: string; portee: PorteeDelai };
  declencheur: string;
  simultaneite: Simultaneite;
  conservation: { texte: string; nature: NatureConservation };
  reprise: { texte: string; nature: NatureReprise };
  montantsObserves: string | null;
  /** Complément financier reçu le 21/10/2026, conservé avec sa provenance. */
  transmissionComplementaire?: TransmissionComplementaire;
  exception: string | null;
  concordance: Concordance;
  note: string;
  /** false : offre absente du catalogue, la donnée est conservée sans fiche. */
  fiche: boolean;
};

export type ExperienceTerrain = {
  edition: string;
  recuLe: string;
  source: string;
  statut: "retour_non_officiel";
  note: string;
  reversement: {
    delai: string;
    declencheur: string;
    notification: string;
    simultaneite: string;
    suivi: string;
    exception: string;
    note: string;
  };
  offres: RetourTerrain[];
};

export const experienceTerrain = raw as ExperienceTerrain;

const parSlug = new Map(experienceTerrain.offres.map((offre) => [offre.slug, offre]));

/** Retour terrain d'une offre, ou undefined : jamais de valeur inventée. */
export function getRetourTerrain(slug: string): RetourTerrain | undefined {
  return parSlug.get(slug);
}

/** Offres du catalogue qui disposent d'un retour terrain affichable. */
export function retoursAffichables(): RetourTerrain[] {
  return experienceTerrain.offres.filter((offre) => offre.fiche);
}

export const CONCORDANCE_TERRAIN_LABEL: Record<Concordance, string> = {
  concorde: "Concorde avec la page officielle",
  ecart: "Écart avec la page officielle",
  non_verifiable: "Page officielle muette ou non vérifiable",
};

export const NATURE_CONSERVATION_LABEL: Record<NatureConservation, string> = {
  clause_officielle: "Clause publiée",
  recommendation_terrain: "Recommandation terrain",
  non_precisee: "Non précisé",
};

export const NATURE_REPRISE_TERRAIN_LABEL: Record<NatureReprise, string> = {
  clause_identifiee: "Clause identifiée",
  constatee: "Reprise constatée",
  precaution: "Précaution",
  non_publiee: "Aucune clause identifiée",
};

export const SIMULTANEITE_LABEL: Record<Simultaneite, string> = {
  simultanee: "Primes versées ensemble",
  non_simultanee: "Primes non simultanées",
};

export type TerrainStats = {
  total: number;
  avecRetour: number;
  simultanees: number;
  nonSimultanees: number;
  concordent: number;
  ecarts: number;
  nonVerifiables: number;
  conservationDocumentee: number;
  reprisesIdentifiees: number;
};

export function computeTerrainStats(offres: readonly RetourTerrain[] = experienceTerrain.offres): TerrainStats {
  return {
    total: experienceTerrain.offres.length,
    avecRetour: offres.length,
    simultanees: offres.filter((o) => o.simultaneite === "simultanee").length,
    nonSimultanees: offres.filter((o) => o.simultaneite === "non_simultanee").length,
    concordent: offres.filter((o) => o.concordance === "concorde").length,
    ecarts: offres.filter((o) => o.concordance === "ecart").length,
    nonVerifiables: offres.filter((o) => o.concordance === "non_verifiable").length,
    conservationDocumentee: offres.filter((o) => o.conservation.nature !== "non_precisee").length,
    reprisesIdentifiees: offres.filter((o) => o.reprise.nature === "clause_identifiee").length,
  };
}
