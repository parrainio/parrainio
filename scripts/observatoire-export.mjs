// Exporte data/observatoire-conditions.json vers le CSV public.
// Source unique de vérité : le JSON. Le CSV ne doit jamais être édité à la main.
//
// Usage : node scripts/observatoire-export.mjs [--check]
//   --check : n'écrit rien, sort en erreur si le CSV diverge du JSON.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const JSON_PATH = "data/observatoire-conditions.json";
const CSV_PATH = "public/data/observatoire-conditions-2026-10-20.csv";
// Retours terrain : fichier distinct, rattaché par slug. Aucune condition
// officielle n'est écrite dans ce fichier, et aucune observation ne l'est dans
// le JSON des conditions.
const TERRAIN_PATH = "data/experience-terrain.json";

const terrain = JSON.parse(fs.readFileSync(TERRAIN_PATH, "utf8"));
const terrainParSlug = new Map(terrain.offres.map((offre) => [offre.slug, offre]));
const retour = (o) => terrainParSlug.get(o.slug);

const COLUMNS = [
  ["slug", (o) => o.slug],
  ["nom", (o) => o.nom],
  ["categorie", (o) => o.categorie],
  ["prime_annoncee", (o) => o.primeAnnoncee],
  ["prime_parrain", (o) => o.primeParrain],
  ["delai_versement_statut", (o) => o.delaiVersement.statut],
  ["delai_versement", (o) => o.delaiVersement.resume],
  ["delai_action", (o) => o.delaiAction?.resume ?? ""],
  ["conservation", (o) => o.conservation?.resume ?? ""],
  ["reprise_nature", (o) => o.reprise.nature],
  ["reprise", (o) => o.reprise.resume],
  ["differences", (o) => o.differences],
  ["ambiguite", (o) => o.ambiguite],
  ["source", (o) => o.source],
  ["lu_le", (o) => o.luLe],
  ["verifie_le", (o) => o.verifieLe ?? ""],
  ["source_statut", (o) => o.sourceStatut ?? ""],
  ["delai_max_valeur", (o) => (o.delaiStructure ? String(o.delaiStructure.valeur) : "")],
  ["delai_unite", (o) => o.delaiStructure?.unite ?? ""],
  ["delai_base", (o) => o.delaiStructure?.base ?? ""],
  ["campagne_fin", (o) => o.campagne?.finLe ?? ""],
  ["reversement_parrainio", (o) => o.reversementParrainio?.montant ?? ""],
  ["reversement_delai", (o) => o.reversementParrainio?.delai ?? ""],
  ["delai_pratique", (o) => o.delaiPratique?.resume ?? ""],
  ["delai_pratique_hypothese", (o) => o.delaiPratique?.hypothese ?? ""],
  ["delai_pratique_exception", (o) => o.delaiPratique?.exception ?? ""],
  ["delai_pratique_statut", (o) => o.delaiPratique?.statut ?? ""],
  ["experience_delai", (o) => o.experience?.delaiObserve ?? ""],
  ["experience_conservation", (o) => o.experience?.conservationConseillee ?? ""],
  ["experience_concordance", (o) => o.experience?.concordance ?? ""],
  ["terrain_delai", (o) => retour(o)?.delai.texte ?? ""],
  ["terrain_declencheur", (o) => retour(o)?.declencheur ?? ""],
  ["terrain_prime_filleul", (o) => retour(o)?.delais.primeFilleul ?? ""],
  ["terrain_commission_parrain", (o) => retour(o)?.delais.commissionParrain ?? ""],
  ["terrain_conservation", (o) => retour(o)?.conservation.texte ?? ""],
  ["terrain_conservation_nature", (o) => retour(o)?.conservation.nature ?? ""],
  ["terrain_reprise_nature", (o) => retour(o)?.reprise.nature ?? ""],
  ["terrain_simultaneite", (o) => retour(o)?.simultaneite ?? ""],
  ["terrain_concordance", (o) => retour(o)?.concordance ?? ""],
  ["terrain_source", (o) => (retour(o) ? terrain.source : "")],
  ["terrain_recu_le", (o) => (retour(o) ? terrain.recuLe : "")],
];

/** Échappe une valeur CSV (séparateur « ; », guillemets, retours à la ligne). */
export function csvCell(value) {
  const text = String(value ?? "");
  return /[";\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(data) {
  const lines = [COLUMNS.map(([name]) => name).join(";")];
  for (const offre of data.offres) {
    lines.push(COLUMNS.map(([, read]) => csvCell(read(offre))).join(";"));
  }
  return `${lines.join("\n")}\n`;
}

/**
 * N'écrit rien à l'import : les tests importent `toCsv` et doivent comparer le
 * CSV existant, pas le régénérer (sinon un CSV périmé passerait inaperçu).
 */
function main() {
  const data = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  const csv = toCsv(data);

  if (process.argv.includes("--check")) {
    const current = fs.existsSync(CSV_PATH) ? fs.readFileSync(CSV_PATH, "utf8") : "";
    if (current !== csv) {
      console.error(`CSV désynchronisé : ${CSV_PATH} ne correspond pas à ${JSON_PATH}.`);
      process.exit(1);
    }
    console.log(`CSV à jour : ${data.offres.length} offres.`);
    return;
  }

  fs.mkdirSync(path.dirname(CSV_PATH), { recursive: true });
  fs.writeFileSync(CSV_PATH, csv);
  console.log(`CSV écrit : ${CSV_PATH} (${data.offres.length} offres, ${COLUMNS.length} colonnes).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
