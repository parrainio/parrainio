#!/usr/bin/env node
/**
 * netlinking-registry.mjs — mise à jour ciblée du registre central.
 *
 * Usage :
 *   node scripts/netlinking-registry.mjs --input temp/patch.json [--dry-run]
 *
 * Entrée : tableau JSON d'objets. Chaque objet contient au minimum `domaine`
 * et les colonnes à modifier, nommées comme dans `base-prospection.csv`
 * (statut, score, modele, contact, source, motif, prochaine_action…).
 *
 * - Le domaine est normalisé (minuscules, sans www.).
 * - Une ligne existante est mise à jour champ par champ ; les autres colonnes
 *   sont conservées telles quelles.
 * - Un domaine absent est ajouté avec les valeurs fournies.
 * - Aucun doublon n'est créé.
 */

import fs from "node:fs";

const REGISTRY = "docs/netlinking/base-prospection.csv";

const HEADER = [
  "domaine", "nom", "url", "page", "contact", "source", "type_opportunite", "score",
  "modele", "decouvert_le", "contacte_le", "statut", "confirmation", "reponse",
  "backlink_url", "motif", "derniere_verif", "prochaine_action",
];

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

function cell(value) {
  const s = String(value ?? "").replace(/\r\n/g, "\n");
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function normalize(domain) {
  return String(domain ?? "").trim().toLowerCase().replace(/^[a-z]+:\/\//, "").split("/")[0].replace(/^www\./, "");
}

function main() {
  const args = process.argv.slice(2);
  const idx = args.indexOf("--input");
  if (idx === -1) {
    console.error("--input <json> requis");
    process.exit(1);
  }
  const dryRun = args.includes("--dry-run");
  const patches = JSON.parse(fs.readFileSync(args[idx + 1], "utf8"));

  const rows = fs.existsSync(REGISTRY) ? parseCsv(fs.readFileSync(REGISTRY, "utf8")) : [];
  const header = rows.length ? rows[0] : HEADER;
  const body = rows.length ? rows.slice(1) : [];
  const index = new Map(body.map((r, i) => [normalize(r[0]), i]));

  let added = 0;
  let updated = 0;
  const unknownColumns = new Set();

  for (const patch of patches) {
    const domain = normalize(patch.domaine);
    if (!domain) continue;
    const existing = index.has(domain) ? body[index.get(domain)] : null;
    const row = existing ? [...existing] : header.map((h) => (h === "domaine" ? domain : ""));
    for (const [key, value] of Object.entries(patch)) {
      if (key === "domaine") continue;
      const col = header.indexOf(key);
      if (col === -1) {
        unknownColumns.add(key);
        continue;
      }
      row[col] = value;
    }
    if (existing) {
      body[index.get(domain)] = row;
      updated += 1;
    } else {
      body.push(row);
      index.set(domain, body.length - 1);
      added += 1;
    }
  }

  if (unknownColumns.size) {
    console.error(`Colonnes inconnues ignorées : ${[...unknownColumns].join(", ")}`);
    process.exitCode = 1;
  }

  if (dryRun) {
    console.log(`[dry-run] ${added} ajout(s), ${updated} mise(s) à jour, ${body.length} ligne(s) au total.`);
    return;
  }
  fs.writeFileSync(REGISTRY, `${header.map(cell).join(";")}\n${body.map((r) => r.map(cell).join(";")).join("\n")}\n`);
  console.log(`${REGISTRY} : ${added} ajout(s), ${updated} mise(s) à jour, ${body.length} ligne(s).`);
}

main();
