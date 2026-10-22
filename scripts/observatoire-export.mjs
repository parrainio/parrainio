// Exporte les sources officielles et les retours terrain dans deux fichiers
// distincts. Les JSON restent les sources de vérité ; ne pas éditer les CSV.
//
// Usage : node scripts/observatoire-export.mjs [--check]
//   --check : n'écrit rien et échoue si l'un des CSV diverge de ses sources.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const JSON_PATH = "data/observatoire-conditions.json";
const TERRAIN_PATH = "data/experience-terrain.json";
const OVERRIDES_PATH = "data/offer-overrides.json";

const official = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
const terrain = JSON.parse(fs.readFileSync(TERRAIN_PATH, "utf8"));
const overrides = JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf8"));
const CSV_PATH = `public/data/observatoire-conditions-${official.releveLe}.csv`;
const TERRAIN_CSV_PATH = `public/data/observatoire-terrain-${terrain.recuLe}.csv`;
const terrainBySlug = new Map(terrain.offres.map((offer) => [offer.slug, offer]));

/** Échappe une valeur CSV (séparateur « ; », guillemets, retours à la ligne). */
export function csvCell(value) {
  const text = String(value ?? "");
  return /[";\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function render(columns, rows) {
  const lines = [columns.map(([name]) => name).join(";")];
  for (const row of rows) lines.push(columns.map(([, read]) => csvCell(read(row))).join(";"));
  return `${lines.join("\n")}\n`;
}

const CONDITION_COLUMNS = [
  ["slug", (o) => o.slug],
  ["nom", (o) => o.nom],
  ["categorie", (o) => o.categorie],
  ["prime_filleul_officielle", (o) => o.primeAnnoncee],
  ["prime_parrain_officielle", (o) => o.primeParrain],
  ["delai_versement_statut", (o) => o.delaiVersement.statut],
  ["delai_versement_resume", (o) => o.delaiVersement.resume],
  ["citation_delai", (o) => o.delaiVersement.citation],
  ["delai_action", (o) => o.delaiAction?.resume ?? ""],
  ["citation_action", (o) => o.delaiAction?.citation ?? ""],
  ["conservation_officielle", (o) => o.conservation?.resume ?? ""],
  ["citation_conservation", (o) => o.conservation?.citation ?? ""],
  ["reprise_nature", (o) => o.reprise.nature],
  ["reprise_resume", (o) => o.reprise.resume],
  ["citation_reprise", (o) => o.reprise.citation],
  ["differences", (o) => o.differences],
  ["ambiguite", (o) => o.ambiguite],
  ["source_officielle", (o) => o.source],
  ["lu_le", (o) => o.luLe],
  ["verifie_le", (o) => o.verifieLe ?? ""],
  ["source_statut", (o) => o.sourceStatut ?? ""],
  ["delai_max_valeur", (o) => (o.delaiStructure ? String(o.delaiStructure.valeur) : "")],
  ["delai_unite", (o) => o.delaiStructure?.unite ?? ""],
  ["delai_base", (o) => o.delaiStructure?.base ?? ""],
  ["delai_base_texte", (o) => o.delaiStructure?.texte ?? ""],
  ["campagne_libelle", (o) => o.campagne?.libelle ?? ""],
  ["campagne_fin", (o) => o.campagne?.finLe ?? ""],
  ["reversement_parrainio_catalogue", (o) => o.reversementParrainio?.montant ?? ""],
  ["reversement_parrainio_source", (o) => o.reversementParrainio?.source ?? ""],
  ["reversement_parrainio_verifie_le", (o) => o.reversementParrainio?.verifieLe ?? ""],
  ["reversement_parrainio_delai", (o) => o.reversementParrainio?.delai ?? ""],
  ["delai_pratique", (o) => o.delaiPratique?.resume ?? ""],
  ["delai_pratique_hypothese", (o) => o.delaiPratique?.hypothese ?? ""],
  ["delai_pratique_exception", (o) => o.delaiPratique?.exception ?? ""],
  ["delai_pratique_statut", (o) => o.delaiPratique?.statut ?? ""],
  ["catalogue_prime_partenaire", (o) => overrides[o.slug]?.partnerReward ?? ""],
  ["catalogue_reversement_parrainio", (o) => overrides[o.slug]?.parrainioReward ?? ""],
  ["catalogue_verifie_le", (o) => overrides[o.slug]?.lastVerifiedAt ?? ""],
  ["catalogue_derniere_maj", (o) => overrides[o.slug]?.lastUpdated ?? ""],
  ["terrain_statut", (o) => (terrainBySlug.has(o.slug) ? terrain.statut : "")],
  ["terrain_source", (o) => (terrainBySlug.has(o.slug) ? terrain.source : "")],
  ["terrain_recu_le", (o) => (terrainBySlug.has(o.slug) ? terrain.recuLe : "")],
  ["terrain_delai", (o) => terrainBySlug.get(o.slug)?.delai.texte ?? ""],
  ["terrain_portee_delai", (o) => terrainBySlug.get(o.slug)?.delai.portee ?? ""],
  ["terrain_prime_filleul", (o) => terrainBySlug.get(o.slug)?.delais.primeFilleul ?? ""],
  ["terrain_commission_parrain", (o) => terrainBySlug.get(o.slug)?.delais.commissionParrain ?? ""],
  ["terrain_reversement_parrainio", (o) => terrainBySlug.get(o.slug)?.delais.reversementParrainio ?? ""],
  ["terrain_declencheur", (o) => terrainBySlug.get(o.slug)?.declencheur ?? ""],
  ["terrain_simultaneite", (o) => terrainBySlug.get(o.slug)?.simultaneite ?? ""],
  ["terrain_conservation", (o) => terrainBySlug.get(o.slug)?.conservation.texte ?? ""],
  ["terrain_conservation_nature", (o) => terrainBySlug.get(o.slug)?.conservation.nature ?? ""],
  ["terrain_reprise", (o) => terrainBySlug.get(o.slug)?.reprise.texte ?? ""],
  ["terrain_reprise_nature", (o) => terrainBySlug.get(o.slug)?.reprise.nature ?? ""],
  ["terrain_montants_observes", (o) => terrainBySlug.get(o.slug)?.montantsObserves ?? ""],
  ["terrain_exception", (o) => terrainBySlug.get(o.slug)?.exception ?? ""],
  ["terrain_concordance", (o) => terrainBySlug.get(o.slug)?.concordance ?? ""],
  ["terrain_note", (o) => terrainBySlug.get(o.slug)?.note ?? ""],
  ["terrain_fiche_catalogue", (o) => (terrainBySlug.has(o.slug) ? String(terrainBySlug.get(o.slug).fiche) : "")],
  ["terrain_transmission_prime", (o) => terrainBySlug.get(o.slug)?.transmissionComplementaire?.primeObservee ?? ""],
  ["terrain_transmission_reversement", (o) => terrainBySlug.get(o.slug)?.transmissionComplementaire?.reversementObserve ?? ""],
  ["terrain_transmission_concordance", (o) => terrainBySlug.get(o.slug)?.transmissionComplementaire?.concordance ?? ""],
  ["terrain_transmission_note", (o) => terrainBySlug.get(o.slug)?.transmissionComplementaire?.note ?? ""],
  ["terrain_reversement_global", (o) => terrain.reversement.delai],
  ["terrain_reversement_declencheur_global", (o) => terrain.reversement.declencheur],
  ["terrain_reversement_exception_global", (o) => terrain.reversement.exception],
  ["terrain_reversement_note_global", (o) => terrain.reversement.note],
];

const TERRAIN_COLUMNS = [
  ["slug", (o) => o.slug],
  ["nom", (o) => o.nom],
  ["fiche_au_catalogue", (o) => String(o.fiche)],
  ["source", () => terrain.source],
  ["statut", () => terrain.statut],
  ["recu_le", () => terrain.recuLe],
  ["delai_prime_filleul", (o) => o.delais.primeFilleul],
  ["delai_prime_parrain_commission", (o) => o.delais.commissionParrain],
  ["delai_reversement_parrainio", (o) => o.delais.reversementParrainio],
  ["delai_resume", (o) => o.delai.texte],
  ["portee_delai", (o) => o.delai.portee],
  ["declencheur", (o) => o.declencheur],
  ["primes_simultanees", (o) => o.simultaneite],
  ["conservation", (o) => o.conservation.texte],
  ["conservation_nature", (o) => o.conservation.nature],
  ["reprise", (o) => o.reprise.texte],
  ["reprise_nature", (o) => o.reprise.nature],
  ["montants_observes", (o) => o.montantsObserves ?? ""],
  ["transmission_prime_observee", (o) => o.transmissionComplementaire?.primeObservee ?? ""],
  ["transmission_reversement_observe", (o) => o.transmissionComplementaire?.reversementObserve ?? ""],
  ["transmission_concordance", (o) => o.transmissionComplementaire?.concordance ?? ""],
  ["exception", (o) => o.exception ?? ""],
  ["concordance_officielle", (o) => o.concordance],
  ["note", (o) => o.note],
  ["transmission_note", (o) => o.transmissionComplementaire?.note ?? ""],
  ["delai_reversement_global", () => terrain.reversement.delai],
  ["declencheur_reversement_global", () => terrain.reversement.declencheur],
  ["simultaneite_globale", () => terrain.reversement.simultaneite],
  ["exception_globale", () => terrain.reversement.exception],
  ["note_reversement_global", () => terrain.reversement.note],
];

export function toCsv(data = official) {
  return render(CONDITION_COLUMNS, data.offres);
}

export function toTerrainCsv(data = terrain) {
  return render(TERRAIN_COLUMNS, data.offres);
}

function main() {
  const outputs = [
    [CSV_PATH, toCsv(official)],
    [TERRAIN_CSV_PATH, toTerrainCsv(terrain)],
  ];

  if (process.argv.includes("--check")) {
    let failed = false;
    for (const [file, expected] of outputs) {
      const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
      if (current !== expected) {
        console.error(`CSV désynchronisé : ${file} ne correspond pas à ses sources.`);
        failed = true;
      } else {
        console.log(`CSV à jour : ${file}`);
      }
    }
    if (failed) process.exitCode = 1;
    return;
  }

  for (const [file, content] of outputs) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
    console.log(`CSV écrit : ${file}`);
  }
  console.log(`${official.offres.length} conditions officielles ; ${terrain.offres.length} observations terrain.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
