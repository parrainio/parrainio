import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const TERRAIN_PATH = "data/experience-terrain.json";
const OFFICIAL_PATH = "data/observatoire-conditions.json";
const CSV_PATH = "public/data/observatoire-terrain-2026-10-21.csv";

const terrain = JSON.parse(fs.readFileSync(TERRAIN_PATH, "utf8"));
const officiel = JSON.parse(fs.readFileSync(OFFICIAL_PATH, "utf8"));
const offresOfficielles = new Set(officiel.offres.map((o) => o.slug));

const CONCORDANCES = new Set(["concorde", "ecart", "non_verifiable"]);
const CONSERVATIONS = new Set(["clause_officielle", "recommendation_terrain", "non_precisee"]);
const REPRISES = new Set(["clause_identifiee", "constatee", "precaution", "non_publiee"]);
const SIMULTANEITES = new Set(["simultanee", "non_simultanee"]);

function parseCsv(content) {
  const rows = [];
  let row = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i];
    if (quoted) {
      if (ch === '"' && content[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ";") {
      row.push(cur);
      cur = "";
    } else if (ch === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else if (ch !== "\r") cur += ch;
  }
  if (cur || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim()));
}

test("terrain : jeu de données daté, sourcé et présenté comme non officiel", () => {
  assert.equal(terrain.statut, "retour_non_officiel");
  assert.equal(terrain.source, "Responsable Parrainio");
  assert.match(terrain.recuLe, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(terrain.note.length > 80, "note de cadrage trop courte");
  assert.match(terrain.note, /ne sont pas des conditions officielles/i);
});

test("terrain : un slug unique par offre, présent dans le catalogue ou signalé", () => {
  const slugs = terrain.offres.map((o) => o.slug);
  assert.equal(new Set(slugs).size, slugs.length, "slugs dupliqués");
  assert.ok(terrain.offres.length >= 14, "offres terrain incomplètes");
  for (const offre of terrain.offres) {
    assert.ok(offre.nom, `${offre.slug} : nom manquant`);
    assert.ok(offre.note.length > 30, `${offre.slug} : note trop courte`);
    assert.ok(offre.declencheur.length > 10, `${offre.slug} : déclencheur manquant`);
    assert.ok(offre.delai.texte.length > 5, `${offre.slug} : délai court manquant`);
    assert.equal(typeof offre.fiche, "boolean", `${offre.slug} : indicateur de fiche absent`);
  }
  // Une offre sans fiche doit être explicitement justifiée par sa note.
  for (const offre of terrain.offres.filter((o) => !o.fiche)) {
    assert.match(offre.note, /catalogue/i, `${offre.slug} : absence de fiche non expliquée`);
  }
});

test("terrain : les trois délais restent des champs séparés", () => {
  for (const offre of terrain.offres) {
    for (const cle of ["primeFilleul", "commissionParrain", "reversementParrainio"]) {
      assert.ok(offre.delais[cle]?.length > 5, `${offre.slug} : delais.${cle} manquant`);
    }
    assert.match(offre.delais.reversementParrainio, /24 à 72 h/, `${offre.slug} : reversement non conforme`);
    assert.ok(SIMULTANEITES.has(offre.simultaneite), `${offre.slug} : simultanéité inconnue`);
    assert.ok(CONCORDANCES.has(offre.concordance), `${offre.slug} : concordance inconnue`);
    assert.ok(CONSERVATIONS.has(offre.conservation.nature), `${offre.slug} : nature de conservation inconnue`);
    assert.ok(REPRISES.has(offre.reprise.nature), `${offre.slug} : nature de reprise inconnue`);
  }
});

test("terrain : l'exception de versement non simultané est unique et documentée", () => {
  const nonSimultanees = terrain.offres.filter((o) => o.simultaneite === "non_simultanee");
  assert.equal(nonSimultanees.length, 1, "une seule offre ne verse pas les deux primes ensemble");
  assert.equal(nonSimultanees[0].slug, "assurancevie-com");
  assert.ok(nonSimultanees[0].exception.length > 40);
  const simultanees = terrain.offres.filter((o) => o.simultaneite === "simultanee");
  assert.equal(simultanees.length, terrain.offres.length - 1);
});

test("terrain : aucune reprise n'est présentée comme constatée sans l'avoir été", () => {
  for (const offre of terrain.offres.filter((o) => o.reprise.nature === "clause_identifiee")) {
    assert.ok(offre.reprise.texte.length > 40, `${offre.slug} : clause non documentée`);
    assert.match(offre.reprise.texte, /mois|clause|publi/i, `${offre.slug} : clause non nommée`);
  }
  assert.equal(
    terrain.offres.filter((o) => o.reprise.nature === "constatee").length,
    0,
    "aucune reprise n'a été constatée personnellement",
  );
});

test("terrain : la mécanique de reversement est datée et attribuée à Parrainio", () => {
  assert.equal(terrain.reversement.delai, "24 à 72 heures");
  assert.match(terrain.reversement.declencheur, /commission/i);
  assert.match(terrain.reversement.simultaneite, /même moment/i);
  assert.match(terrain.reversement.note, /précéder/i);
  assert.match(terrain.reversement.note, /exception/i);
  assert.doesNotMatch(terrain.reversement.note, /ne peut donc jamais précéder/i);
  assert.equal(terrain.reversement.exception, "assurancevie-com");
});

test("terrain : l'observatoire officiel n'embarque aucune observation", () => {
  for (const offre of officiel.offres) {
    assert.equal("experience" in offre, false, `${offre.slug} : complément terrain dans le JSON officiel`);
    assert.equal("terrain" in offre, false, `${offre.slug} : observation écrite dans le JSON officiel`);
    assert.equal("delais" in offre, false, `${offre.slug} : délais terrain dans le JSON officiel`);
  }
});

test("terrain : huit offres du périmètre officiel ont un retour rattachable", () => {
  const rattachees = terrain.offres.filter((o) => offresOfficielles.has(o.slug));
  assert.equal(rattachees.length, 8, "périmètre du rattachement inattendu");
  for (const offre of rattachees) {
    assert.equal(offre.fiche, true, `${offre.slug} : retour terrain non affichable`);
  }
});

test("terrain : le CSV dédié conserve intégralement les quatorze observations", () => {
  const rows = parseCsv(fs.readFileSync(CSV_PATH, "utf8"));
  const header = rows[0];
  const objects = rows.slice(1).map((r) => Object.fromEntries(header.map((k, i) => [k, r[i] ?? ""])));

  for (const key of [
    "delai_prime_filleul", "delai_prime_parrain_commission", "delai_reversement_parrainio",
    "declencheur", "conservation", "conservation_nature", "reprise", "reprise_nature",
    "montants_observes", "exception", "concordance_officielle", "note",
    "transmission_prime_observee", "transmission_reversement_observe", "transmission_note", "source", "recu_le",
  ]) {
    assert.ok(header.includes(key), `colonne ${key} absente`);
  }

  assert.equal(objects.length, 14, "le CSV ne reprend pas tous les retours terrain");
  const bySlug = new Map(objects.map((row) => [row.slug, row]));
  for (const retour of terrain.offres) {
    const row = bySlug.get(retour.slug);
    assert.ok(row, `${retour.slug} : observation absente du CSV`);
    assert.equal(row.nom, retour.nom);
    assert.equal(row.fiche_au_catalogue, String(retour.fiche));
    assert.equal(row.source, terrain.source);
    assert.equal(row.statut, terrain.statut);
    assert.equal(row.recu_le, terrain.recuLe);
    assert.equal(row.delai_prime_filleul, retour.delais.primeFilleul);
    assert.equal(row.delai_prime_parrain_commission, retour.delais.commissionParrain);
    assert.equal(row.delai_reversement_parrainio, retour.delais.reversementParrainio);
    assert.equal(row.declencheur, retour.declencheur);
    assert.equal(row.conservation, retour.conservation.texte);
    assert.equal(row.reprise, retour.reprise.texte);
    assert.equal(row.montants_observes, retour.montantsObserves ?? "");
    assert.equal(row.exception, retour.exception ?? "");
    assert.equal(row.concordance_officielle, retour.concordance);
    assert.equal(row.note, retour.note);
    assert.equal(row.transmission_prime_observee, retour.transmissionComplementaire?.primeObservee ?? "");
    assert.equal(row.transmission_reversement_observe, retour.transmissionComplementaire?.reversementObserve ?? "");
    assert.equal(row.transmission_note, retour.transmissionComplementaire?.note ?? "");
  }
});
