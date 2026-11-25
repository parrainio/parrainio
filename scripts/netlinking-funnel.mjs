#!/usr/bin/env node
/**
 * netlinking-funnel.mjs — entonnoir de campagne, calculé depuis les fichiers réels.
 *
 * Usage :
 *   node scripts/netlinking-funnel.mjs                  # tableau lisible
 *   node scripts/netlinking-funnel.mjs --json           # JSON exploitable
 *   node scripts/netlinking-funnel.mjs --workspace dir  # autre dossier (tests)
 *
 * Dix états, dans l'ordre :
 *   1. découvert            → lignes du registre
 *   2. qualifié             → statut « Qualifié, à contacter »
 *   3. brouillon            → messages en file « brouillon » + formulaires préparés
 *   4. autorisé             → messages en file « approuve »
 *   5. envoyé               → messages « envoye » + formulaires soumis
 *   6. accepté SMTP         → entrées du journal d'envoi (≠ délivré)
 *   7. bounce ou réponse    → lignes de réponses-email.jsonl
 *   8. publication annoncée → statut « Publication promise, non vérifiée »
 *   9. page contrôlée       → backlink_url renseigné dans le registre
 *  10. backlink vérifié     → lignes de 3-backlinks-verifies.csv
 *
 * La délivrabilité n'est jamais comptée : aucune donnée du dépôt ne la prouve.
 */

import fs from "node:fs";
import path from "node:path";

export const DEFAULT_FILES = {
  registry: "docs/netlinking/base-prospection.csv",
  queue: "docs/netlinking/campagne-email/file-attente.json",
  journal: "docs/netlinking/campagne-email/journal-envois.jsonl",
  replies: "docs/netlinking/donnees/reponses-email.jsonl",
  backlinks: "docs/netlinking/3-backlinks-verifies.csv",
  drafts: "docs/netlinking/brouillons-vague-3.csv",
  draftsVague5: "docs/netlinking/brouillons-vague-5.csv",
  draftsVague6: "docs/netlinking/brouillons-vague-6.csv",
  draftsVague7: "docs/netlinking/brouillons-vague-7.csv",
};

export function parseCsv(content) {
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

function readIfExists(file, reader, fallback) {
  return fs.existsSync(file) ? reader(fs.readFileSync(file, "utf8")) : fallback;
}

function readJsonl(content) {
  return content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

function csvObjects(content) {
  const rows = parseCsv(content);
  if (rows.length === 0) return [];
  const header = rows[0];
  return rows.slice(1).map((r) => Object.fromEntries(header.map((k, i) => [k, r[i] ?? ""])));
}

/** Compte les états. Aucun envoi, aucune écriture. */
export function computeFunnel(files = DEFAULT_FILES) {
  const registry = readIfExists(files.registry, csvObjects, []);
  const queue = readIfExists(files.queue, (c) => JSON.parse(c), { messages: [] });
  const journal = readIfExists(files.journal, readJsonl, []);
  const replies = readIfExists(files.replies, readJsonl, []);
  const backlinkRows = readIfExists(files.backlinks, csvObjects, []);
  const drafts = [
    ...readIfExists(files.drafts, csvObjects, []),
    ...(files.draftsVague5 ? readIfExists(files.draftsVague5, csvObjects, []) : []),
    ...(files.draftsVague6 ? readIfExists(files.draftsVague6, csvObjects, []) : []),
    ...(files.draftsVague7 ? readIfExists(files.draftsVague7, csvObjects, []) : []),
  ];

  const messages = Array.isArray(queue.messages) ? queue.messages : [];
  const status = (s) => messages.filter((m) => m.status === s).length;

  const emailDrafts = status("brouillon");
  const formDrafts = drafts.filter(
    (d) => (d.canal ?? "").toLowerCase().includes("formulaire") && /brouillon/i.test(d.statut ?? ""),
  ).length;

  const emailsSent = status("envoye");
  const formsSent = registry.filter((r) => /Formulaire soumis/i.test(r.statut ?? "")).length;

  const smtpAccepted = journal.filter((j) => j.ok === true).length;
  const bounces = replies.filter((r) => r.category === "echec_livraison").length;
  const answers = replies.filter((r) => r.category !== "echec_livraison").length;

  const publicationAnnoncee = registry.filter((r) => /Publication promise/i.test(r.statut ?? "")).length;
  const pageControlee = registry.filter((r) => (r.backlink_url ?? "").trim() !== "").length;

  const states = {
    decouvert: registry.length,
    qualifie: registry.filter((r) => /^Qualifié/i.test(r.statut ?? "")).length,
    brouillon: emailDrafts + formDrafts,
    autorise: status("approuve"),
    envoye: emailsSent + formsSent,
    smtpAccepte: smtpAccepted,
    bounce: bounces,
    reponse: answers,
    publicationAnnoncee,
    pageControlee,
    backlinkVerifie: backlinkRows.length,
  };

  const sent = states.envoye;
  const rates = {
    rebond: sent > 0 ? bounces / Math.max(smtpAccepted, 1) : 0,
    reponse: sent > 0 ? answers / sent : 0,
    publication: sent > 0 ? publicationAnnoncee / sent : 0,
    backlink: sent > 0 ? states.backlinkVerifie / sent : 0,
  };

  return {
    generatedAt: new Date().toISOString(),
    files,
    states,
    rates,
    channels: {
      email: { brouillon: emailDrafts, autorise: status("approuve"), envoye: emailsSent, smtpAccepte: smtpAccepted },
      formulaire: { brouillon: formDrafts, envoye: formsSent },
    },
    /** La délivrabilité n'est pas observable : le champ reste null, jamais true. */
    delivre: null,
    delivreNote:
      "Aucune donnée du dépôt ne prouve la délivrabilité : 250 queued = accepté par le serveur, pas reçu par le destinataire.",
  };
}

const LABELS = [
  ["decouvert", "1. Découvert"],
  ["qualifie", "2. Qualifié"],
  ["brouillon", "3. Brouillon préparé"],
  ["autorise", "4. Autorisé"],
  ["envoye", "5. Envoyé / soumis"],
  ["smtpAccepte", "6. Accepté SMTP (≠ délivré)"],
  ["bounce", "   dont bounce identifié"],
  ["reponse", "7. Réponse reçue"],
  ["publicationAnnoncee", "8. Publication annoncée"],
  ["pageControlee", "9. Page contrôlée"],
  ["backlinkVerifie", "10. Backlink vérifié"],
];

const pct = (v) => `${(v * 100).toFixed(1).replace(".", ",")} %`;

export function renderMarkdown(funnel) {
  const lines = [
    "| État | Nombre |",
    "|---|---:|",
    ...LABELS.map(([key, label]) => `| ${label} | ${funnel.states[key]} |`),
    "",
    `Taux de réponse : ${pct(funnel.rates.reponse)} — taux de publication : ${pct(funnel.rates.publication)} — backlinks vérifiés : ${pct(funnel.rates.backlink)}.`,
    "",
    `> ${funnel.delivreNote}`,
  ];
  return lines.join("\n");
}

function parseArgs(argv) {
  const out = { json: false, workspace: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--json") out.json = true;
    else if (argv[i] === "--workspace") out.workspace = argv[i + 1];
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = args.workspace
    ? {
        registry: path.join(args.workspace, "base-prospection.csv"),
        queue: path.join(args.workspace, "file-attente.json"),
        journal: path.join(args.workspace, "journal-envois.jsonl"),
        replies: path.join(args.workspace, "reponses-email.jsonl"),
        backlinks: path.join(args.workspace, "3-backlinks-verifies.csv"),
        drafts: path.join(args.workspace, "brouillons-vague-3.csv"),
      }
    : DEFAULT_FILES;

  const funnel = computeFunnel(files);
  console.log(args.json ? JSON.stringify(funnel, null, 2) : renderMarkdown(funnel));
}

if (process.argv[1] && process.argv[1].endsWith("netlinking-funnel.mjs")) main();
