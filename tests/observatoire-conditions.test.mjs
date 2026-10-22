import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const DATA_PATH = "data/observatoire-conditions.json";
const CSV_PATH = "public/data/observatoire-conditions-2026-10-22.csv";

const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
const STATUTS = new Set(["annonce", "renvoi", "non_publie"]);
const NATURES = new Set(["prelevement", "non_paiement", "aucune_publication"]);
const UNITES = new Set(["jours", "jours_ouvres", "mois"]);

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
      assert.ok(offre.delaiVersement.citation.length > 10, `${offre.slug} : délai chiffré sans repère de source`);
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
  assert.equal(count((o) => o.reprise.nature === "prelevement"), 5);
  assert.equal(count((o) => o.reprise.nature === "non_paiement"), 1);
  assert.equal(count((o) => o.reprise.nature === "aucune_publication"), 5);
  assert.equal(count((o) => o.delaiAction !== null), 11);
  assert.equal(count((o) => o.conservation !== null), 5);
  assert.equal(offres.length, 11);
});

test("observatoire : les délais structurés correspondent à un parcours et un statut chiffré", () => {
  for (const offre of data.offres) {
    const structure = offre.delaiStructure ?? null;
    if (!structure) continue;
    assert.equal(offre.delaiVersement.statut, "annonce", `${offre.slug} : structure sans délai annoncé`);
    assert.ok(Number.isInteger(structure.valeur) && structure.valeur > 0, `${offre.slug} : valeur invalide`);
    assert.ok(UNITES.has(structure.unite), `${offre.slug} : unité inconnue`);
    assert.ok(structure.base && structure.texte, `${offre.slug} : base ou texte manquant`);
  }
});

test("observatoire : le jeu officiel ne contient aucun retour terrain", () => {
  for (const offre of data.offres) {
    assert.equal("experience" in offre, false, `${offre.slug} : observation mélangée aux conditions officielles`);
    assert.equal("terrain" in offre, false, `${offre.slug} : retour terrain incorporé au fichier officiel`);
    assert.equal("delais" in offre, false, `${offre.slug} : délais terrain incorporés au fichier officiel`);
  }
});

test("observatoire : la vérification du 22/10 est datée et sourcée", () => {
  assert.equal(data.verifieLe, "2026-10-22");
  for (const offre of data.offres) {
    assert.equal(offre.verifieLe, "2026-10-22", `${offre.slug} : date de vérification absente`);
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
  assert.ok(Object.keys(rows[0]).length >= 60, "colonnes de provenance ou terrain absentes");
  for (const key of ["citation_delai", "conditions_officielles", "repere_conditions", "sources_complementaires", "catalogue_prime_partenaire", "terrain_montants_observes", "terrain_exception", "terrain_note", "terrain_transmission_note"]) {
    assert.ok(key in rows[0], `colonne ${key} absente`);
  }
  assert.deepEqual(rows.map((r) => r.slug), data.offres.map((o) => o.slug));
  for (const [i, offre] of data.offres.entries()) {
    assert.equal(rows[i].delai_versement_statut, offre.delaiVersement.statut, `${offre.slug} : statut divergent`);
    assert.equal(rows[i].reprise_nature, offre.reprise.nature, `${offre.slug} : nature divergente`);
    assert.equal(rows[i].source_officielle, offre.source, `${offre.slug} : source divergente`);
    assert.equal(rows[i].lu_le, offre.luLe, `${offre.slug} : date divergente`);
    assert.equal(rows[i].conditions_officielles, offre.conditionsOffre.resume, `${offre.slug} : conditions absentes du CSV`);
    assert.equal(rows[i].sources_complementaires.split(" | ").length, offre.sourcesComplementaires.length, `${offre.slug} : provenance absente du CSV`);
  }
});

test("observatoire : chaque offre publique expose des conditions et des sources complémentaires datées", () => {
  for (const offre of data.offres) {
    assert.ok(offre.conditionsOffre.resume.length > 80, `${offre.slug} : conditions trop peu documentées`);
    assert.ok(offre.conditionsOffre.citation.length > 10, `${offre.slug} : repère de source absent`);
    assert.ok(offre.sourcesComplementaires.length > 0, `${offre.slug} : source détaillée absente`);
    for (const source of offre.sourcesComplementaires) {
      assert.match(source.url, /^https:\/\//, `${offre.slug} : URL de source non sécurisée`);
      assert.match(source.verifieLe, /^\d{4}-\d{2}-\d{2}$/, `${offre.slug} : source non datée`);
      assert.ok(source.label.length > 5, `${offre.slug} : intitulé de source trop court`);
    }
  }
});

test("observatoire : corrections des parcours officiels sensibles conservées", () => {
  const bySlug = Object.fromEntries(data.offres.map((offre) => [offre.slug, offre]));
  assert.match(bySlug.n26.delaiVersement.resume, /60 jours calendaires/);
  assert.doesNotMatch(bySlug.n26.delaiVersement.resume, /ouvrés/);
  assert.match(bySlug.linxea.primeAnnoncee, /50 € pour le parrain et 50 € pour le filleul/);
  assert.match(bySlug.simplis.primeAnnoncee, /filleul : 50 €.*Garantie Décennale/is);
  assert.match(bySlug.fortuneo.conditionsOffre.resume, /PEA\/PEA-PME.*CTO.*Fortuneo Vie/);
  assert.match(bySlug["meilleurtaux-com"].differences, /1 000 €.*70 € chacun/s);
  assert.match(bySlug["direct-assurance"].conditionsOffre.resume, /500 € TTC par an/);
});

test("observatoire : les divergences financières prioritaires sont conservées par source", () => {
  const boursobank = data.offres.find((o) => o.slug === "boursobank");
  assert.match(boursobank.primeAnnoncee, /240/);
  assert.match(boursobank.differences, /150/);
  assert.match(boursobank.ambiguite, /10\/20\/40/);
  assert.match(boursobank.primeAnnoncee, /10\/30\/60/);
  const assuranceVie = data.offres.find((o) => o.slug === "assurancevie-com");
  assert.match(assuranceVie.primeParrain, /100/);
  assert.match(assuranceVie.differences, /50/);
  assert.equal(assuranceVie.delaiPratique.statut, "non_calculable");
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
