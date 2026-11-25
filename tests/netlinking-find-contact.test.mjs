import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  applyProposal,
  discoverContactPages,
  extractEmails,
  findContactForDomain,
  rankContactEmails,
  runFindContacts,
} from "../scripts/netlinking-find-contact.mjs";

const SITE = "bounce-test.fr";

const REGISTRY_HEADER =
  "domaine;nom;url;page;contact;source;type_opportunite;score;modele;decouvert_le;contacte_le;statut;confirmation;reponse;backlink_url;motif;derniere_verif;prochaine_action";
const CONTACTS_HEADER =
  "domaine;nom;email;source_url;date_verification;type_contact;confiance;thematique;score;modele;objet;texte_pret_a_envoyer;statut;raison_non_envoi";

function workspace({ contactRows = [], statut = "Tentative non confirmée" } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "find-contact-"));
  const paths = {
    replies: path.join(dir, "reponses-email.jsonl"),
    contacts: path.join(dir, "contacts-email.csv"),
    registry: path.join(dir, "base-prospection.csv"),
    oppositions: path.join(dir, "oppositions.csv"),
    out: path.join(dir, "contacts-alternatifs.jsonl"),
  };
  const row = {
    domaine: SITE,
    nom: "Bounce Test",
    url: `https://${SITE}`,
    page: `https://${SITE}/contact`,
    contact: `contact@${SITE}`,
    statut,
    derniere_verif: "2026-10-20",
    prochaine_action: "Adresse invalide (échec de livraison)",
  };
  fs.writeFileSync(paths.registry, `${REGISTRY_HEADER}\n${REGISTRY_HEADER.split(";").map((k) => row[k] ?? "").join(";")}\n`);
  fs.writeFileSync(paths.contacts, `${CONTACTS_HEADER}\n${contactRows.map((r) => CONTACTS_HEADER.split(";").map((k) => r[k] ?? "").join(";")).join("\n")}${contactRows.length ? "\n" : ""}`);
  fs.writeFileSync(paths.oppositions, "domaine;nom;date;canal;motif\n");
  fs.writeFileSync(
    paths.replies,
    JSON.stringify({ domain: SITE, category: "echec_livraison", failedRecipients: [`contact@${SITE}`] }) + "\n",
  );
  return paths;
}

const responder = (routes) => async (url) => {
  const pathname = new URL(url).pathname.replace(/\/+$/, "") || "/";
  const html = routes[pathname];
  if (html === undefined) return { status: 404, finalUrl: url, text: "", contentType: "text/html" };
  if (typeof html === "number") return { status: html, finalUrl: url, text: "", contentType: "text/html" };
  return { status: 200, finalUrl: url, text: html, contentType: "text/html" };
};

/* ---------------------------------------------------------- extraction */

test("1. extrait les adresses publiées (mailto prioritaire, entités décodées)", () => {
  const html = `<a href="mailto:redaction@bounce-test.fr?subject=Contact">écrire</a><p>ou contact&#64;bounce-test.fr</p>`;
  const found = extractEmails(html, `https://${SITE}/contact`);
  assert.deepEqual(
    found.map((e) => e.address).sort(),
    [`contact@${SITE}`, `redaction@${SITE}`],
  );
  assert.equal(found.find((e) => e.address.startsWith("redaction")).kind, "mailto");
});

test("2. ignore les adresses techniques et les images", () => {
  const html = `<p>noreply@bounce-test.fr postmaster@bounce-test.fr logo@2x.png sentry@o1.ingest.sentry.io</p>`;
  assert.deepEqual(extractEmails(html, `https://${SITE}/`), []);
});

test("3. repère les pages de contact et mentions légales du même site", () => {
  const html = `<a href="/contact/">Contact</a><a href="https://${SITE}/mentions-legales">Mentions légales</a><a href="https://autre.fr/contact">Autre</a>`;
  assert.deepEqual(discoverContactPages(html, `https://${SITE}/`), [
    `https://${SITE}/contact`,
    `https://${SITE}/mentions-legales`,
  ]);
});

test("4. classe le domaine du site avant une boîte grand public et écarte l'adresse rejetée", () => {
  const ranked = rankContactEmails(
    [
      { address: `contact@${SITE}`, kind: "mailto", sourceUrl: `https://${SITE}/contact` },
      { address: "perso@gmail.com", kind: "texte", sourceUrl: `https://${SITE}/contact` },
      { address: `ancienne@${SITE}`, kind: "mailto", sourceUrl: `https://${SITE}/contact` },
    ],
    { domain: SITE, invalidEmails: [`ancienne@${SITE}`] },
  );
  assert.equal(ranked[0].address, `contact@${SITE}`);
  assert.equal(ranked[0].confidence, "Confirmée");
  assert.equal(ranked.some((r) => r.address === `ancienne@${SITE}`), false);
  assert.equal(ranked.at(-1).confidence, "À vérifier");
});

/* ------------------------------------------------------------- recherche */

test("5. adresse retrouvée sur la page de contact du site", async () => {
  const fetchImpl = responder({
    "/": `<html><body><a href="/contact/">Nous contacter</a></body></html>`,
    "/contact": `<html><body><p>Écrivez-nous :</p><a href="mailto:redaction@${SITE}">redaction@${SITE}</a></body></html>`,
  });
  const result = await findContactForDomain(SITE, { fetchImpl, invalidEmails: [`contact@${SITE}`] });
  assert.equal(result.status, "trouvee");
  assert.equal(result.address, `redaction@${SITE}`);
  assert.equal(result.confidence, "Confirmée");
  assert.equal(result.sourceUrl, `https://${SITE}/contact`);
  assert.equal(result.invalidEmails, undefined);
});

test("6. aucune adresse publiée : introuvable, aucune invention", async () => {
  const fetchImpl = responder({ "/": `<html><body><p>Bienvenue</p></body></html>` });
  const result = await findContactForDomain(SITE, { fetchImpl, invalidEmails: [] });
  assert.equal(result.status, "introuvable");
  assert.equal(result.address, "");
  assert.deepEqual(result.alternatives, []);
});

test("7. blocage 403 : arrêt du domaine, aucun contournement", async () => {
  let calls = 0;
  const fetchImpl = async (url) => {
    calls += 1;
    return { status: 403, finalUrl: url, text: "<html>Forbidden</html>", contentType: "text/html" };
  };
  const result = await findContactForDomain(SITE, { fetchImpl });
  assert.equal(result.status, "bloque");
  assert.equal(calls, 1, "on ne réessaie pas les autres pages après un 403");
  assert.equal(result.address, "");
});

test("8. erreur réseau : erreur temporaire, pas « introuvable » définitif", async () => {
  const fetchImpl = async () => {
    throw Object.assign(new Error("ETIMEDOUT"), { code: "ETIMEDOUT" });
  };
  const result = await findContactForDomain(SITE, { fetchImpl });
  assert.equal(result.status, "erreur temporaire");
  assert.match(result.note, /ETIMEDOUT|timeout/i);
});

/* ------------------------------------------------------------- écritures */

test("9. --apply ajoute l'adresse et met à jour le registre sans envoyer", async () => {
  const paths = workspace();
  const fetchImpl = responder({
    "/contact": `<a href="mailto:redaction@${SITE}">redaction@${SITE}</a>`,
  });
  const summary = await runFindContacts({
    paths,
    domains: [SITE],
    fetchImpl,
    apply: true,
    log: () => {},
  });
  assert.equal(summary.found, 1);
  assert.equal(summary.applied, 1);
  const contacts = fs.readFileSync(paths.contacts, "utf8");
  assert.match(contacts, new RegExp(`redaction@${SITE}`));
  assert.match(contacts, /Adresse alternative trouvée, envoi à décider manuellement/);
  const registry = fs.readFileSync(paths.registry, "utf8");
  assert.match(registry, new RegExp(`redaction@${SITE}`));
  assert.match(registry, /envoi à décider manuellement/);
  // La sortie JSONL conserve la provenance et la date de vérification.
  const proposal = JSON.parse(fs.readFileSync(paths.out, "utf8").trim());
  assert.equal(proposal.sourceUrl, `https://${SITE}/contact`);
  assert.equal(proposal.confidence, "Confirmée");
  assert.ok(proposal.foundAt);
});

test("10. --apply est idempotent : une adresse déjà connue n'est pas dupliquée", async () => {
  const paths = workspace({
    contactRows: [{ domaine: SITE, nom: "Bounce Test", email: `redaction@${SITE}`, statut: "E-mail envoyé" }],
  });
  const fetchImpl = responder({ "/contact": `<a href="mailto:redaction@${SITE}">écrire</a>` });
  const summary = await runFindContacts({ paths, domains: [SITE], fetchImpl, apply: true, log: () => {} });
  assert.equal(summary.applied, 0);
  const rows = fs.readFileSync(paths.contacts, "utf8").trim().split("\n");
  assert.equal(rows.length, 2, "en-tête + une seule ligne");
  assert.equal((fs.readFileSync(paths.contacts, "utf8").match(new RegExp(`redaction@${SITE}`, "g")) ?? []).length, 1);
});

test("11. un domaine en opposition est ignoré sans être visité", async () => {
  const paths = workspace();
  fs.writeFileSync(paths.oppositions, `domaine;nom;date;canal;motif\n${SITE};Bounce Test;2026-10-21;email;stop\n`);
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    throw new Error("ne doit pas être appelé");
  };
  const summary = await runFindContacts({ paths, domains: [SITE], fetchImpl, apply: true, log: () => {} });
  assert.equal(calls, 0);
  assert.equal(summary.skipped, 1);
  assert.equal(fs.readFileSync(paths.contacts, "utf8").trim().split("\n").length, 1);
});

test("12. --dry-run n'écrit ni proposition ni contact", async () => {
  const paths = workspace();
  const fetchImpl = responder({ "/contact": `<a href="mailto:redaction@${SITE}">écrire</a>` });
  await runFindContacts({ paths, domains: [SITE], fetchImpl, apply: true, dryRun: true, log: () => {} });
  assert.equal(fs.existsSync(paths.out), false);
  assert.equal(fs.readFileSync(paths.contacts, "utf8").trim().split("\n").length, 1);
  assert.match(fs.readFileSync(paths.registry, "utf8"), /contact@bounce-test.fr/);
});

test("13. applyProposal refuse une recherche non concluante", () => {
  const paths = workspace();
  const result = applyProposal(paths, { domain: SITE, status: "introuvable", address: "" });
  assert.equal(result.contactAdded, false);
  assert.equal(result.registryUpdated, false);
});

test("14. seule l'adresse rejetée est publiée : aucune alternative inventée", async () => {
  const fetchImpl = responder({
    "/": `<a href="mailto:contact@${SITE}">contact@${SITE}</a>`,
    "/contact": `<p>contact@${SITE}</p>`,
  });
  const result = await findContactForDomain(SITE, { fetchImpl, invalidEmails: [`contact@${SITE}`] });
  assert.equal(result.status, "introuvable");
  assert.equal(result.address, "");
  assert.match(result.note, /seule l'adresse rejetée/i);
});

test("15. les adresses de formulaire factices (abc@xyz.com…) sont ignorées", () => {
  const html = `<input placeholder="abc@xyz.com"><p>exemple@exemple.fr — test@test.com</p><p>info@${SITE}</p>`;
  const found = extractEmails(html, `https://${SITE}/contact`);
  assert.deepEqual(
    found.map((e) => e.address),
    [`info@${SITE}`],
  );
});

test("17. date_verification reste une date même si l'horodatage est une fonction ou un Date", () => {
  for (const now of [() => "2026-10-20T10:00:00.000Z", new Date("2026-10-20T10:00:00.000Z"), "2026-10-20T10:00:00.000Z"]) {
    const paths = workspace();
    const result = applyProposal(
      paths,
      { domain: SITE, status: "trouvee", address: `redaction@${SITE}`, sourceUrl: `https://${SITE}/contact`, confidence: "Confirmée" },
      { now },
    );
    assert.equal(result.contactAdded, true);
    const contacts = fs.readFileSync(paths.contacts, "utf8");
    assert.match(contacts, /;2026-10-20;/, "date_verification doit être AAAA-MM-JJ");
    assert.doesNotMatch(contacts, /\(\) =>|function|Invalid Date/);
  }
});

test("16. la date inscrite dans le registre est une vraie date, pas une fonction", async () => {
  const paths = workspace();
  const fetchImpl = responder({ "/contact": `<a href="mailto:redaction@${SITE}">écrire</a>` });
  await runFindContacts({ paths, domains: [SITE], fetchImpl, apply: true, log: () => {} });
  const registry = fs.readFileSync(paths.registry, "utf8");
  assert.match(registry, /trouvée le \d{4}-\d{2}-\d{2}/);
  assert.doesNotMatch(registry, /\(\) =>|function/);
});
