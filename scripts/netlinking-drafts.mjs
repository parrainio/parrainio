#!/usr/bin/env node
/**
 * netlinking-drafts.mjs — mise à jour des files de contacts et de brouillons.
 *
 * Usage :
 *   node scripts/netlinking-drafts.mjs --input temp/qualifies.json
 *   node scripts/netlinking-drafts.mjs --input temp/qualifies.json --dry-run
 *
 * Entrée : un tableau JSON d'objets :
 *   {
 *     "domaine": "exemple.fr", "nom": "Exemple", "url": "https://exemple.fr",
 *     "email": "contact@exemple.fr", "emailSource": "https://exemple.fr/mentions-legales",
 *     "confiance": "Confirmée" | "À vérifier",
 *     "typeContact": "rédaction" | "webmaster" | "partenariat" | "contact général",
 *     "thematique": "finances personnelles", "score": 14, "modele": 1,
 *     "objet": "…", "corps": "…", "statut": "Brouillon prêt", "raisonNonEnvoi": "…"
 *   }
 *
 * Le script n'envoie rien. Il écrit/met à jour :
 *   docs/netlinking/contacts-email.csv
 *   docs/netlinking/brouillons-email.csv
 * Les domaines déjà présents sont mis à jour, jamais dupliqués.
 */

import fs from "node:fs";
import path from "node:path";

const DIR = "docs/netlinking";
const CONTACTS = path.join(DIR, "contacts-email.csv");
const DRAFTS = path.join(DIR, "brouillons-email.csv");
const ACTIONS = path.join(DIR, "actions-manuelles.csv");
const RELANCES = path.join(DIR, "relances-email.csv");

const RELANCE_HEADER = [
  "domaine", "nom", "destinataire", "message_id_initial", "objet_initial", "envoye_le",
  "relance_prevue_le", "objet_relance", "corps_relance", "statut", "condition",
];

const ACTION_HEADER = [
  "site", "domaine", "url_action", "type_blocage", "motif", "objet", "texte_a_copier",
  "champs", "conditions_url", "score", "etat_tentative", "prochaine_action", "derniere_verif",
];

const CONTACT_HEADER = [
  "domaine", "nom", "email", "source_url", "date_verification", "type_contact",
  "confiance", "thematique", "score", "modele", "objet", "texte_pret_a_envoyer",
  "statut", "raison_non_envoi",
];
const DRAFT_HEADER = [
  "domaine", "nom", "destinataire", "source_adresse", "modele", "objet", "corps", "statut",
];

function cell(value) {
  // Les retours à la ligne sont conservés : le corps du message doit rester
  // copiable tel quel. Un champ multi-lignes est entre guillemets (CSV standard).
  const s = String(value ?? "").replace(/\r\n/g, "\n");
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Analyseur CSV réel : gère les guillemets et les retours à la ligne internes. */
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

function readCsv(file, header) {
  if (!fs.existsSync(file)) return { header, rows: [] };
  const rows = parseCsv(fs.readFileSync(file, "utf8"));
  if (rows.length <= 1) return { header, rows: [] };
  return { header: rows[0], rows: rows.slice(1) };
}

function writeCsv(file, header, rows) {
  const body = rows.map((r) => r.map(cell).join(";")).join("\n");
  fs.writeFileSync(file, `${header.map(cell).join(";")}\n${body}\n`);
}

/** Génère la file de relances (aucun envoi : la décision reste humaine). */
function writeRelances(file, dryRun) {
  const items = JSON.parse(fs.readFileSync(file, "utf8"));
  const rows = items.map((r) => [
    r.domaine, r.nom ?? "", r.to, r.messageId ?? "", r.objetInitial ?? "", r.envoyeLe ?? "",
    r.relanceLe ?? "", r.objetRelance ?? "", r.corpsRelance ?? "", r.statut ?? "A envoyer si aucune reponse",
    r.condition ?? "Une seule relance, et seulement si aucune reponse n'a ete recue",
  ]);
  rows.sort((a, b) => a[0].localeCompare(b[0]));
  if (dryRun) {
    console.log(`[dry-run] ${rows.length} relance(s).`);
    return;
  }
  writeCsv(RELANCES, RELANCE_HEADER, rows);
  console.log(`${RELANCES} : ${rows.length} relance(s).`);
}

/** Génère la file d'actions manuelles depuis un JSON dédié. */
function writeActions(file, dryRun) {
  const items = JSON.parse(fs.readFileSync(file, "utf8"));
  const today = new Date().toISOString().slice(0, 10);
  const rows = items.map((a) => [
    a.site, a.domaine, a.url, a.blocage, a.motif, a.objet, a.texte, a.champs,
    a.conditions, a.score, a.etat, a.prochaine, a.date ?? today,
  ]);
  rows.sort((a, b) => a[1].localeCompare(b[1]));
  if (dryRun) {
    console.log(`[dry-run] ${rows.length} action(s) manuelle(s).`);
    return;
  }
  writeCsv(ACTIONS, ACTION_HEADER, rows);
  console.log(`${ACTIONS} : ${rows.length} action(s) manuelle(s).`);
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const actionsIndex = args.indexOf("--actions");
  const relancesIndex = args.indexOf("--relances");
  const inputIndex = args.indexOf("--input");

  if (actionsIndex !== -1) {
    writeActions(args[actionsIndex + 1], dryRun);
    return;
  }
  if (relancesIndex !== -1) {
    writeRelances(args[relancesIndex + 1], dryRun);
    return;
  }
  if (inputIndex === -1) {
    console.error("--input <json> ou --actions <json> requis");
    process.exit(1);
  }
  const entries = JSON.parse(fs.readFileSync(args[inputIndex + 1], "utf8"));
  const today = new Date().toISOString().slice(0, 10);

  const contacts = readCsv(CONTACTS, CONTACT_HEADER);
  const drafts = readCsv(DRAFTS, DRAFT_HEADER);

  let added = 0;
  let updated = 0;

  for (const e of entries) {
    const domain = String(e.domaine ?? "").toLowerCase().replace(/^www\./, "");
    if (!domain) continue;

    const contactRow = [
      domain, e.nom ?? "", e.email ?? "", e.emailSource ?? "", e.date ?? today,
      e.typeContact ?? "contact général", e.confiance ?? "À vérifier", e.thematique ?? "",
      e.score ?? "", e.modele ?? "", e.objet ?? "", e.corps ?? "",
      e.statut ?? "Brouillon prêt", e.raisonNonEnvoi ?? "",
    ];

    // Le texte de contact et le brouillon proviennent de la même source :
    // les deux fichiers ne peuvent pas diverger à la génération.
    const contactIdx = contacts.rows.findIndex((r) => r[0] === domain);
    if (contactIdx >= 0) {
      contacts.rows[contactIdx] = contactRow;
      updated += 1;
    } else {
      contacts.rows.push(contactRow);
      added += 1;
    }

    if (e.objet && e.corps) {
      const draftRow = [
        domain, e.nom ?? "", e.email ?? "", e.emailSource ?? "", e.modele ?? "",
        e.objet, e.corps, e.statut ?? "Brouillon prêt",
      ];
      const draftIdx = drafts.rows.findIndex((r) => r[0] === domain);
      if (draftIdx >= 0) drafts.rows[draftIdx] = draftRow;
      else drafts.rows.push(draftRow);
    }
  }

  contacts.rows.sort((a, b) => a[0].localeCompare(b[0]));
  drafts.rows.sort((a, b) => a[0].localeCompare(b[0]));

  if (dryRun) {
    console.log(`[dry-run] ${added} contact(s) ajouté(s), ${updated} mis à jour ; ${drafts.rows.length} brouillon(s).`);
    return;
  }
  fs.mkdirSync(DIR, { recursive: true });
  writeCsv(CONTACTS, CONTACT_HEADER, contacts.rows);
  writeCsv(DRAFTS, DRAFT_HEADER, drafts.rows);
  console.log(
    `${CONTACTS} : ${contacts.rows.length} contact(s) (${added} ajouté(s), ${updated} mis à jour).\n` +
      `${DRAFTS} : ${drafts.rows.length} brouillon(s).`,
  );
}

main();
