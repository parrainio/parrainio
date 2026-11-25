import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { computeFunnel, renderMarkdown, DEFAULT_FILES } from "../scripts/netlinking-funnel.mjs";

const REGISTRY_HEADER =
  "domaine;nom;url;page;contact;source;type_opportunite;score;modele;decouvert_le;contacte_le;statut;confirmation;reponse;backlink_url;motif;derniere_verif;prochaine_action";

function csvRow(header, values) {
  return header.split(";").map((k) => values[k] ?? "").join(";");
}

function workspace({ omit = [] } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "funnel-"));
  const files = {
    registry: path.join(dir, "base-prospection.csv"),
    queue: path.join(dir, "file-attente.json"),
    journal: path.join(dir, "journal-envois.jsonl"),
    replies: path.join(dir, "reponses-email.jsonl"),
    backlinks: path.join(dir, "3-backlinks-verifies.csv"),
    drafts: path.join(dir, "brouillons-vague-3.csv"),
  };

  const registryRows = [
    { domaine: "a.fr", statut: "Qualifié, à contacter" },
    { domaine: "b.fr", statut: "Formulaire soumis, confirmation observée" },
    { domaine: "c.fr", statut: "Formulaire soumis, confirmation observée" },
    { domaine: "d.fr", statut: "Exclu, avec raison" },
  ];
  if (!omit.includes("registry")) {
    fs.writeFileSync(
      files.registry,
      `${REGISTRY_HEADER}\n${registryRows.map((r) => csvRow(REGISTRY_HEADER, r)).join("\n")}\n`,
    );
  }

  if (!omit.includes("queue")) {
    fs.writeFileSync(
      files.queue,
      JSON.stringify({
        messages: [
          { id: "a", status: "brouillon" },
          { id: "b", status: "brouillon" },
          { id: "c", status: "approuve" },
          { id: "d", status: "envoye" },
        ],
      }),
    );
  }

  if (!omit.includes("journal")) {
    fs.writeFileSync(files.journal, `${JSON.stringify({ id: "d", ok: true, response: "250 queued" })}\n`);
  }

  if (!omit.includes("replies")) {
    fs.writeFileSync(
      files.replies,
      [
        JSON.stringify({ domain: "d.fr", category: "echec_livraison" }),
        JSON.stringify({ domain: "b.fr", category: "reponse_positive" }),
      ].join("\n") + "\n",
    );
  }

  if (!omit.includes("backlinks")) {
    fs.writeFileSync(files.backlinks, "Domaine source;URL source\n");
  }

  if (!omit.includes("drafts")) {
    fs.writeFileSync(
      files.drafts,
      [
        "domaine;nom;email;canal;source_url;score;type_proposition;objet;corps;statut;preuve",
        "b.fr;B;;formulaire;https://b.fr/contact;10;Article;Objet;Corps;Brouillon, non envoyé;preuve",
        "a.fr;A;;e-mail;https://a.fr/contact;10;Article;Objet;Corps;Brouillon, non envoyé;preuve",
      ].join("\n") + "\n",
    );
  }

  return files;
}

test("funnel : les dix états sont calculés depuis les fichiers", () => {
  const files = workspace();
  const funnel = computeFunnel(files);
  assert.equal(funnel.states.decouvert, 4);
  assert.equal(funnel.states.qualifie, 1);
  assert.equal(funnel.states.brouillon, 3, "2 messages en file + 1 formulaire préparé");
  assert.equal(funnel.states.autorise, 1);
  assert.equal(funnel.states.envoye, 3, "1 e-mail envoyé + 2 formulaires soumis");
  assert.equal(funnel.states.smtpAccepte, 1);
  assert.equal(funnel.states.bounce, 1);
  assert.equal(funnel.states.reponse, 1);
  assert.equal(funnel.states.publicationAnnoncee, 0);
  assert.equal(funnel.states.pageControlee, 0);
  assert.equal(funnel.states.backlinkVerifie, 0);
});

test("funnel : un brouillon e-mail n'est pas compté comme un formulaire", () => {
  const funnel = computeFunnel(workspace());
  assert.equal(funnel.channels.email.brouillon, 2);
  assert.equal(funnel.channels.formulaire.brouillon, 1);
});

test("funnel : l'acceptation SMTP n'est jamais présentée comme une délivrance", () => {
  const funnel = computeFunnel(workspace());
  assert.equal(funnel.delivre, null);
  assert.match(funnel.delivreNote, /pas reçu par le destinataire/);
  const md = renderMarkdown(funnel);
  assert.match(md, /Accepté SMTP \(≠ délivré\)/);
  assert.doesNotMatch(md, /\| Délivré \|/);
});

test("funnel : les taux sont calculés sur les messages réellement partis", () => {
  const funnel = computeFunnel(workspace());
  assert.equal(funnel.rates.reponse, 1 / 3);
  assert.equal(funnel.rates.publication, 0);
  assert.equal(funnel.rates.backlink, 0);
});

test("funnel : des fichiers absents donnent des zéros, sans exception", () => {
  const files = workspace({ omit: ["registry", "queue", "journal", "replies", "backlinks", "drafts"] });
  const funnel = computeFunnel(files);
  assert.equal(funnel.states.decouvert, 0);
  assert.equal(funnel.states.envoye, 0);
  assert.equal(funnel.rates.reponse, 0);
});

test("funnel : les chemins par défaut pointent vers les fichiers de campagne", () => {
  assert.match(DEFAULT_FILES.registry, /base-prospection\.csv$/);
  assert.match(DEFAULT_FILES.journal, /journal-envois\.jsonl$/);
  assert.match(DEFAULT_FILES.replies, /reponses-email\.jsonl$/);
});
