import { test } from "node:test";
import assert from "node:assert/strict";
import { echeanceAuPlusTard, formatDateFr } from "../lib/observatoireEcheance.mjs";

const iso = (date) => (date ? date.toISOString().slice(0, 10) : null);

test("échéance : aucun délai publié ne produit aucune date", () => {
  assert.equal(echeanceAuPlusTard(null, "2026-10-21"), null);
  assert.equal(echeanceAuPlusTard(undefined, "2026-10-21"), null);
});

test("échéance : une date invalide ne produit aucune date", () => {
  assert.equal(echeanceAuPlusTard({ valeur: 2, unite: "mois" }, ""), null);
  assert.equal(echeanceAuPlusTard({ valeur: 2, unite: "mois" }, "2026-13-40"), null);
});

test("échéance : deux mois calendaires", () => {
  assert.equal(iso(echeanceAuPlusTard({ valeur: 2, unite: "mois" }, "2026-11-05")), "2027-01-05");
});

test("échéance : un mois sur fin de mois ne déborde pas", () => {
  assert.equal(iso(echeanceAuPlusTard({ valeur: 1, unite: "mois" }, "2026-01-31")), "2026-02-28");
  assert.equal(iso(echeanceAuPlusTard({ valeur: 1, unite: "mois" }, "2028-01-31")), "2028-02-29");
  assert.equal(iso(echeanceAuPlusTard({ valeur: 1, unite: "mois" }, "2026-08-31")), "2026-09-30");
});

test("échéance : jours calendaires", () => {
  assert.equal(iso(echeanceAuPlusTard({ valeur: 15, unite: "jours" }, "2026-12-20")), "2027-01-04");
});

test("échéance : jours ouvrés, week-ends exclus", () => {
  // 21/10/2026 est un mercredi ; 60 jours ouvrés = 12 semaines pleines.
  assert.equal(iso(echeanceAuPlusTard({ valeur: 60, unite: "jours_ouvres" }, "2026-10-21")), "2027-01-13");
  // Vendredi + 1 jour ouvré = lundi.
  assert.equal(iso(echeanceAuPlusTard({ valeur: 1, unite: "jours_ouvres" }, "2026-10-23")), "2026-10-26");
  // Samedi + 1 jour ouvré = lundi.
  assert.equal(iso(echeanceAuPlusTard({ valeur: 1, unite: "jours_ouvres" }, "2026-10-24")), "2026-10-26");
});

test("échéance : format lisible en français", () => {
  const date = echeanceAuPlusTard({ valeur: 2, unite: "mois" }, "2026-11-05");
  assert.equal(formatDateFr(date), "5 janvier 2027");
});
