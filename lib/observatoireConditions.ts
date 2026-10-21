import raw from "@/data/observatoire-conditions.json";
import { getRetourTerrain, type RetourTerrain } from "./experienceTerrain";

export type StatutDelai = "annonce" | "renvoi" | "non_publie";
export type NatureReprise = "prelevement" | "non_paiement" | "aucune_publication";
export type UniteDelai = "jours" | "jours_ouvres" | "mois";
export type BaseDelai =
  | "ouverture_effective"
  | "ouverture_definitive"
  | "ouverture_compte"
  | "reussite_parrainage"
  | "validation_parrainage"
  | "entree_en_vigueur_contrat"
  | "signature_contrat_assurance_pret"
  | "souscription_contrat";

export type BlocCitation = {
  resume: string;
  citation: string;
};

export type BlocDelai = BlocCitation & { statut: StatutDelai };
export type BlocReprise = BlocCitation & { nature: NatureReprise };

/** Délai chiffré tel que publié, dans son unité d'origine. */
export type DelaiStructure = {
  valeur: number;
  unite: UniteDelai;
  base: BaseDelai;
  texte: string;
};

/** Retour d'expérience du responsable : jamais une condition officielle. */
export type Experience = {
  statut: "retour_non_officiel";
  source: string;
  recuLe: string;
  delaiObserve: string;
  conservationConseillee: string;
  primeObservee: string;
  reversementObserve: string;
  concordance: "concorde" | "ecart" | "non_verifiable";
  note: string;
};

export type Campagne = { libelle: string; finLe: string };

/**
 * Estimation du délai vécu par le filleul : délai bancaire publié + traitement
 * du reversement. Ce n'est ni une condition bancaire ni une promesse.
 */
export type DelaiPratique = {
  statut: "estimation_parrainio" | "non_calculable";
  /** Résumé public, null quand aucun délai n'est publié. */
  resume: string | null;
  /** Sur quoi repose l'estimation (ou pourquoi elle est absente). */
  hypothese: string;
  /** Exception de calendrier propre à l'offre, s'il y en a une. */
  exception: string | null;
};

/** Délai de reversement annoncé par Parrainio, distinct des conditions bancaires. */
export type Reversement = {
  delai: string;
  declencheur: string;
  statut: "engagement_parrainio";
  source: string;
  recuLe: string;
  note: string;
};

export type OffreObservatoire = {
  slug: string;
  nom: string;
  categorie: string;
  primeAnnoncee: string;
  primeParrain: string;
  delaiVersement: BlocDelai;
  delaiAction: BlocCitation | null;
  conservation: BlocCitation | null;
  reprise: BlocReprise;
  differences: string;
  ambiguite: string;
  source: string;
  luLe: string;
  verifieLe?: string;
  sourceStatut?: string;
  delaiStructure?: DelaiStructure | null;
  delaiPratique?: DelaiPratique;
  reversementParrainio?: { montant: string; source: string; verifieLe: string; delai?: string };
  campagne?: Campagne | null;
  experience?: Experience;
  /** Retour terrain rattaché par slug, jamais recopié dans le JSON officiel. */
  terrain?: RetourTerrain;
};

export type Observatoire = {
  edition: string;
  releveLe: string;
  verifieLe?: string;
  noteVerification?: string;
  perimetre: string;
  offres: OffreObservatoire[];
  exclues: { nom: string; motif: string }[];
  reversement: Reversement;
  noteDelaiPratique: string;
};

const base = raw as Observatoire;

/**
 * Les onze offres officielles, enrichies de leur retour terrain quand il
 * existe. Les deux jeux de données restent séparés sur disque : le JSON
 * officiel ne contient aucune observation, le JSON terrain aucune condition.
 */
export const observatoire: Observatoire = {
  ...base,
  offres: base.offres.map((offre) => ({ ...offre, terrain: getRetourTerrain(offre.slug) })),
};

/** Offres du périmètre dont le délai constaté est chiffré. */
export function offresAvecTerrain() {
  return observatoire.offres.filter((offre) => offre.terrain);
}

export const STATUT_DELAI_LABEL: Record<StatutDelai, string> = {
  annonce: "Délai chiffré",
  renvoi: "Renvoi aux mentions",
  non_publie: "Non publié",
};

export const NATURE_REPRISE_LABEL: Record<NatureReprise, string> = {
  prelevement: "Prélèvement rétroactif",
  non_paiement: "Non-paiement",
  aucune_publication: "Non publié",
};

export const BASE_DELAI_LABEL: Record<BaseDelai, string> = {
  ouverture_effective: "à partir de l'ouverture effective du compte",
  ouverture_definitive: "à partir de l'ouverture définitive du compte",
  ouverture_compte: "à partir de l'ouverture du compte",
  reussite_parrainage: "à partir de la validation du parrainage",
  validation_parrainage: "à partir de la validation du parrainage",
  entree_en_vigueur_contrat: "à partir de l'entrée en vigueur du contrat",
  signature_contrat_assurance_pret: "à partir de la signature du contrat d'assurance de prêt",
  souscription_contrat: "à partir de la souscription du contrat",
};

export const DELAI_PRATIQUE_LABEL: Record<DelaiPratique["statut"], string> = {
  estimation_parrainio: "Estimation Parrainio",
  non_calculable: "Pas d'estimation",
};

export const CONCORDANCE_LABEL: Record<Experience["concordance"], string> = {
  concorde: "Concorde avec la page officielle",
  ecart: "Écart avec la page officielle",
  non_verifiable: "Non vérifiable sur la page officielle",
};

export type ObservatoireStats = {
  total: number;
  delaiChiffre: number;
  delaiRenvoi: number;
  delaiNonPublie: number;
  reprisePrelevement: number;
  repriseNonPaiement: number;
  repriseNonPubliee: number;
  delaiActionDocumente: number;
  conservationDocumentee: number;
  /** Offres pour lesquelles un délai pratique estimé peut être affiché. */
  estimationDisponible: number;
  /** Offres du périmètre qui disposent d'un délai constaté sur le terrain. */
  terrainDocumente: number;
};

/** Comptages descriptifs. Les dénominateurs sont toujours le nombre d'offres incluses. */
export function computeStats(offres: readonly OffreObservatoire[] = observatoire.offres): ObservatoireStats {
  const count = <T extends string>(values: T[], expected: T) => values.filter((v) => v === expected).length;
  const delais = offres.map((o) => o.delaiVersement.statut);
  const reprises = offres.map((o) => o.reprise.nature);
  return {
    total: offres.length,
    delaiChiffre: count(delais, "annonce"),
    delaiRenvoi: count(delais, "renvoi"),
    delaiNonPublie: count(delais, "non_publie"),
    reprisePrelevement: count(reprises, "prelevement"),
    repriseNonPaiement: count(reprises, "non_paiement"),
    repriseNonPubliee: count(reprises, "aucune_publication"),
    delaiActionDocumente: offres.filter((o) => o.delaiAction !== null).length,
    conservationDocumentee: offres.filter((o) => o.conservation !== null).length,
    estimationDisponible: offres.filter((o) => o.delaiPratique?.statut === "estimation_parrainio").length,
    terrainDocumente: offres.filter((o) => o.terrain).length,
  };
}

// Calcul d'échéance isolé dans un module JS pour être testé par node:test.
export { echeanceAuPlusTard, formatDateFr } from "./observatoireEcheance.mjs";
// Statut des campagnes datées, isolé de la même façon.
export { campagneActive, campagneLabel, dateDuJourParis } from "./observatoireCampagne.mjs";

/** Phrase de citation prête à l'emploi, avec son dénominateur et sa date. */
export function phraseCle(stats: ObservatoireStats = computeStats()): string {
  const releve = new Date(`${observatoire.releveLe}T12:00:00Z`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return `Sur ${stats.total} offres de parrainage bancaire dont la page officielle a été lue le ${releve}, ${stats.delaiChiffre} indiquent un délai de versement chiffré, et ${stats.reprisePrelevement} seulement décrivent un prélèvement rétroactif de la prime.`;
}
