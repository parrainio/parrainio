import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const DATA_PATH = "data/observatoire-conditions.json";
const CSV_PATH = "public/data/observatoire-conditions-2026-10-22.csv";

const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
const STATUTS = new Set(["estimation_parrainio", "non_calculable"]);

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

test("délai pratique : présent sur les onze offres, dans une énumération fermée", () => {
  assert.equal(data.offres.length, 11);
  for (const offre of data.offres) {
    assert.ok(offre.delaiPratique, `${offre.slug} : délai pratique absent`);
    assert.ok(STATUTS.has(offre.delaiPratique.statut), `${offre.slug} : statut inconnu`);
  }
});

test("délai pratique : jamais d'estimation quand la banque ne publie pas de délai", () => {
  for (const offre of data.offres) {
    const bloc = offre.delaiPratique;
    const publie = offre.delaiVersement.statut === "annonce";
    const calculable = publie && Boolean(offre.delaiStructure) && !["assurancevie-com", "meilleurtaux-com"].includes(offre.slug);
    assert.equal(
      bloc.statut === "estimation_parrainio",
      calculable,
      `${offre.slug} : estimation incompatible avec le statut du délai publié`,
    );
    assert.equal(
      Boolean(bloc.resume),
      calculable,
      `${offre.slug} : résumé d'estimation sans délai structuré`,
    );
    if (!calculable) {
      assert.equal(bloc.resume, null, `${offre.slug} : une durée est inventée`);
      assert.ok(bloc.hypothese.length > 30, `${offre.slug} : absence non expliquée`);
    }
  }
});

test("délai pratique : l'estimation sépare explicitement le délai bancaire du reversement", () => {
  for (const offre of data.offres) {
    const bloc = offre.delaiPratique;
    if (!bloc.resume) continue;
    assert.match(bloc.resume, /puis 24 à 72 h/, `${offre.slug} : reversement non distingué`);
    assert.ok(
      bloc.resume.length > offre.delaiStructure.texte.length,
      `${offre.slug} : estimation plus courte que le délai publié`,
    );
    assert.ok(bloc.hypothese.length > 20, `${offre.slug} : hypothèse non documentée`);
    if (bloc.exception !== null) {
      assert.ok(bloc.exception.length > 40, `${offre.slug} : exception trop vague`);
    }
  }
});

test("délai pratique : la note globale interdit de le lire comme une garantie", () => {
  assert.match(data.noteDelaiPratique, /estimation/i);
  assert.match(data.noteDelaiPratique, /garantie/i);
  assert.match(data.noteDelaiPratique, /suppose/i);
});

test("reversement Parrainio : délai unique, daté et attribué à Parrainio", () => {
  assert.equal(data.reversement.delai, "24 à 72 heures");
  assert.equal(data.reversement.statut, "engagement_parrainio");
  assert.ok(data.reversement.source.length > 5);
  assert.match(data.reversement.recuLe, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(data.reversement.note, /pas une condition bancaire/i);
  for (const offre of data.offres) {
    if (!offre.reversementParrainio) continue;
    assert.equal(
      offre.reversementParrainio.delai,
      data.reversement.delai,
      `${offre.slug} : délai de reversement divergent`,
    );
  }
});

test("délai pratique : les retours terrain restent hors du JSON officiel", () => {
  for (const offre of data.offres) {
    assert.equal("experience" in offre, false, `${offre.slug} : observation fusionnée dans le relevé officiel`);
    assert.equal("terrain" in offre, false, `${offre.slug} : retour terrain présent dans les conditions officielles`);
  }
});

test("délai pratique : le CSV expose les nouvelles colonnes sans les confondre", () => {
  const rows = csvObjects();
  assert.ok(Object.keys(rows[0]).length >= 60, "colonnes CSV incomplètes");
  for (const key of [
    "delai_pratique",
    "delai_pratique_hypothese",
    "delai_pratique_exception",
    "delai_pratique_statut",
    "reversement_parrainio_delai",
    "terrain_reversement_global",
  ]) {
    assert.ok(key in rows[0], `colonne ${key} absente`);
  }
  for (const [i, offre] of data.offres.entries()) {
    assert.equal(rows[i].delai_pratique, offre.delaiPratique.resume ?? "", `${offre.slug} : estimation divergente`);
    assert.equal(rows[i].delai_pratique_statut, offre.delaiPratique.statut, `${offre.slug} : statut divergent`);
    assert.equal(rows[i].terrain_reversement_global, data.reversement.delai, `${offre.slug} : reversement divergent`);
  }
});
