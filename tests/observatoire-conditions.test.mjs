import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const DATA_PATH = "data/observatoire-conditions.json";
const CSV_PATH = "public/data/observatoire-conditions-2026-10-20.csv";

const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
const STATUTS = new Set(["annonce", "renvoi", "non_publie"]);
const NATURES = new Set(["prelevement", "non_paiement", "aucune_publication"]);
const UNITES = new Set(["jours", "jours_ouvres", "mois"]);
const CONCORDANCES = new Set(["concorde", "ecart", "non_verifiable"]);

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
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

function csvObjects() {
  const rows = parseCsv(fs.readFileSync(CSV_PATH, "utf8"));
  const header = rows[0];
  return rows.slice(1).map((r) => Object.fromEntries(header.map((k, i) => [k, r[i] ?? ""])));
}

test("observatoire : le jeu de données est lisible et daté", () => {
  assert.equal(typeof data.releveLe, "string");
  assert.match(data.releveLe, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(data.offres.length > 0);
  assert.ok(data.perimetre.length > 40);
});

test("observatoire : un slug unique par offre, source https et date de relevé identique", () => {
  const slugs = data.offres.map((o) => o.slug);
  assert.equal(new Set(slugs).size, slugs.length, "slugs dupliqués");
  for (const offre of data.offres) {
    assert.match(offre.source, /^https:\/\//, `${offre.slug} : source non https`);
    assert.equal(offre.luLe, data.releveLe, `${offre.slug} : date de lecture incohérente`);
    assert.ok(offre.nom && offre.categorie, `${offre.slug} : nom ou catégorie manquant`);
  }
});

test("observatoire : statuts et natures appartiennent aux énumérations", () => {
  for (const offre of data.offres) {
    assert.ok(STATUTS.has(offre.delaiVersement.statut), `${offre.slug} : statut de délai inconnu`);
    assert.ok(NATURES.has(offre.reprise.nature), `${offre.slug} : nature de reprise inconnue`);
    assert.ok(offre.delaiVersement.resume.length > 15, `${offre.slug} : résumé de délai trop court`);
    assert.ok(offre.reprise.resume.length > 15, `${offre.slug} : résumé de reprise trop court`);
  }
});

test("observatoire : une affirmation chiffrée a toujours sa citation", () => {
  for (const offre of data.offres) {
    if (offre.delaiVersement.statut === "annonce") {
      assert.ok(offre.delaiVersement.citation.length > 30, `${offre.slug} : délai chiffré sans citation`);
    }
    if (offre.reprise.nature === "prelevement" || offre.reprise.nature === "non_paiement") {
      assert.ok(offre.reprise.citation.length > 30, `${offre.slug} : reprise affirmée sans citation`);
    }
    for (const bloc of [offre.delaiAction, offre.conservation]) {
      if (!bloc) continue;
      assert.ok(bloc.resume.length > 10, `${offre.slug} : bloc sans résumé`);
      assert.ok(bloc.citation.length > 20, `${offre.slug} : bloc sans citation`);
    }
  }
});

test("observatoire : les comptages publiés correspondent aux données", () => {
  const offres = data.offres;
  const count = (fn) => offres.filter(fn).length;
  // Audit du 21/10/2026 : Direct Assurance publie un délai, Hello bank! et Monabanq
  // décrivent un prélèvement. Ces comptages ont donc changé depuis le relevé initial.
  assert.equal(count((o) => o.delaiVersement.statut === "annonce"), 9);
  assert.equal(count((o) => o.delaiVersement.statut === "renvoi"), 1);
  assert.equal(count((o) => o.delaiVersement.statut === "non_publie"), 1);
  assert.equal(count((o) => o.reprise.nature === "prelevement"), 4);
  assert.equal(count((o) => o.reprise.nature === "non_paiement"), 1);
  assert.equal(count((o) => o.reprise.nature === "aucune_publication"), 6);
  assert.equal(count((o) => o.delaiAction !== null), 6);
  assert.equal(count((o) => o.conservation !== null), 3);
  assert.equal(offres.length, 11);
});

test("observatoire : un délai chiffré a toujours sa structure, et réciproquement", () => {
  for (const offre of data.offres) {
    const structure = offre.delaiStructure ?? null;
    assert.equal(
      offre.delaiVersement.statut === "annonce",
      Boolean(structure),
      `${offre.slug} : statut et structure de délai incohérents`,
    );
    if (!structure) continue;
    assert.ok(Number.isInteger(structure.valeur) && structure.valeur > 0, `${offre.slug} : valeur invalide`);
    assert.ok(UNITES.has(structure.unite), `${offre.slug} : unité inconnue`);
    assert.ok(structure.base && structure.texte, `${offre.slug} : base ou texte manquant`);
  }
});

test("observatoire : les retours d'expérience sont séparés et étiquetés", () => {
  const avecExperience = data.offres.filter((o) => o.experience);
  assert.ok(avecExperience.length >= 7, "retours d'expérience manquants");
  for (const offre of avecExperience) {
    const exp = offre.experience;
    assert.equal(exp.statut, "retour_non_officiel", `${offre.slug} : retour présenté comme officiel`);
    assert.ok(exp.source && exp.recuLe, `${offre.slug} : source du retour manquante`);
    assert.ok(CONCORDANCES.has(exp.concordance), `${offre.slug} : concordance inconnue`);
    assert.ok(exp.note.length > 40, `${offre.slug} : note trop courte`);
  }
  assert.ok(avecExperience.some((o) => o.experience.concordance === "ecart"), "aucun écart signalé");
});

test("observatoire : la vérification du 21/10 est datée et sourcée", () => {
  assert.equal(data.verifieLe, "2026-10-21");
  for (const offre of data.offres) {
    assert.equal(offre.verifieLe, "2026-10-21", `${offre.slug} : date de vérification absente`);
    assert.ok(offre.sourceStatut, `${offre.slug} : statut de source absent`);
  }
});

test("observatoire : le CSV public est l'export exact du JSON", async () => {
  const { toCsv } = await import("../scripts/observatoire-export.mjs");
  assert.equal(fs.readFileSync(CSV_PATH, "utf8"), toCsv(data), "CSV désynchronisé : lancer scripts/observatoire-export.mjs");
});

test("observatoire : le CSV public reprend exactement les mêmes offres", () => {
  assert.ok(fs.existsSync(CSV_PATH), "CSV absent");
  const rows = csvObjects();
  assert.equal(rows.length, data.offres.length);
  assert.equal(Object.keys(rows[0]).length, 41, "colonnes CSV inattendues");
  assert.ok("verifie_le" in rows[0] && "experience_concordance" in rows[0], "colonnes d'audit absentes");
  assert.deepEqual(rows.map((r) => r.slug), data.offres.map((o) => o.slug));
  for (const [i, offre] of data.offres.entries()) {
    assert.equal(rows[i].delai_versement_statut, offre.delaiVersement.statut, `${offre.slug} : statut divergent`);
    assert.equal(rows[i].reprise_nature, offre.reprise.nature, `${offre.slug} : nature divergente`);
    assert.equal(rows[i].source, offre.source, `${offre.slug} : source divergente`);
    assert.equal(rows[i].lu_le, offre.luLe, `${offre.slug} : date divergente`);
  }
});

test("observatoire : une campagne datée se ferme à sa date de fin, sans prolongation", async () => {
  const { campagneActive, campagneLabel, dateDuJourParis } = await import("../lib/observatoireCampagne.mjs");
  const campagne = { libelle: "Campagne de test", finLe: "2026-10-31" };

  assert.equal(campagneActive(campagne, "2026-10-30"), true);
  assert.equal(campagneActive(campagne, "2026-10-31"), true, "le dernier jour reste ouvert");
  assert.equal(campagneActive(campagne, "2026-11-01"), false, "campagne prolongée après sa date de fin");
  assert.equal(campagneLabel(campagne, "2026-10-21"), "Campagne jusqu’au 31/10/2026");
  assert.equal(campagneLabel(campagne, "2026-11-01"), "Campagne terminée le 31/10/2026");
  assert.equal(dateDuJourParis(new Date("2026-10-20T22:30:00Z")), "2026-10-21", "jour calculé à Paris, pas en UTC");

  const dates = data.offres.filter((o) => o.campagne);
  assert.ok(dates.length >= 2, "campagnes datées manquantes");
  for (const offre of dates) {
    assert.match(offre.campagne.finLe, /^\d{4}-\d{2}-\d{2}$/, `${offre.slug} : date de fin non ISO`);
  }
  for (const offre of data.offres) {
    assert.doesNotMatch(offre.primeAnnoncee, /en cours/i, `${offre.slug} : campagne « en cours » sans date de fin`);
  }
});

test("observatoire : aucune offre du périmètre n'est comptée deux fois entre incluses et écartées", () => {
  const inclus = new Set(data.offres.map((o) => o.nom));
  for (const e of data.exclues) {
    assert.ok(e.motif.length > 20, `${e.nom} : motif de rejet trop court`);
    assert.equal(inclus.has(e.nom), false, `${e.nom} : présente à la fois dans incluses et écartées`);
  }
});
