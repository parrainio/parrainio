import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const REGISTRY = "docs/netlinking/base-prospection.csv";
const CONTACTS = "docs/netlinking/contacts-email.csv";
const DRAFTS = "docs/netlinking/brouillons-vague-3.csv";
const DRAFTS_VAGUE5 = "docs/netlinking/brouillons-vague-5.csv";
const QUEUE = "docs/netlinking/campagne-email/file-attente.json";
const STATS = "docs/netlinking/stats.json";

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

function objects(path) {
  const rows = parseCsv(fs.readFileSync(path, "utf8").replace(/^\uFEFF/, ""));
  const header = rows[0];
  return rows.slice(1).map((r) => Object.fromEntries(header.map((k, i) => [k, r[i] ?? ""])));
}

const registry = objects(REGISTRY);
const contacts = objects(CONTACTS);
const drafts = objects(DRAFTS);
const draftsVague5 = objects(DRAFTS_VAGUE5);
const queue = JSON.parse(fs.readFileSync(QUEUE, "utf8")).messages;
const stats = JSON.parse(fs.readFileSync(STATS, "utf8"));

test("registre : aucun domaine en double", () => {
  const domains = registry.map((r) => r.domaine.toLowerCase());
  const duplicates = domains.filter((d, i) => domains.indexOf(d) !== i);
  assert.deepEqual([...new Set(duplicates)], [], "domaines dupliqués");
});

test("registre : aucun couple domaine + URL en double", () => {
  const keys = registry.map((r) => `${r.domaine.toLowerCase()}|${r.url.trim()}`);
  const duplicates = keys.filter((k, i) => keys.indexOf(k) !== i);
  assert.deepEqual([...new Set(duplicates)], [], "couples dupliqués");
});

test("registre : chaque ligne qualifiée a une page et un contact", () => {
  for (const row of registry.filter((r) => /^Qualifié/i.test(r.statut))) {
    assert.ok(row.page && row.page.startsWith("http"), `${row.domaine} : page manquante`);
    assert.ok(row.contact, `${row.domaine} : contact manquant`);
  }
});

test("contacts : une seule adresse par domaine, source datée", () => {
  const domains = contacts.map((c) => c.domaine.toLowerCase());
  assert.deepEqual(domains.filter((d, i) => domains.indexOf(d) !== i), [], "domaines dupliqués");
  for (const c of contacts) {
    const canalFormulaire = /formulaire/i.test(c.source_url ?? "") || /formulaire/i.test(c.raison_non_envoi ?? "");
    if (!canalFormulaire) assert.match(c.email, /@/, `${c.domaine} : adresse invalide`);
    assert.match(c.date_verification, /^\d{4}-\d{2}-\d{2}$/, `${c.domaine} : date de vérification absente`);
  }
});

test("file d'attente : identifiants et adresses uniques", () => {
  const ids = queue.map((m) => m.id);
  const tos = queue.map((m) => m.to.toLowerCase());
  assert.equal(new Set(ids).size, ids.length, "identifiants dupliqués");
  assert.equal(new Set(tos).size, tos.length, "adresses dupliquées");
});

// Les boîtes grand public ne désignent pas un site : on ne peut pas en déduire un domaine.
const PUBLIC_MAILBOXES = new Set(["gmail.com", "pm.me", "protonmail.com", "outlook.fr", "yahoo.fr", "hotmail.fr", "free.fr"]);

test("file d'attente : aucun message approuvé sans trace, aucun domaine hors registre", () => {
  const registered = new Set(registry.map((r) => r.domaine.toLowerCase()));
  for (const message of queue) {
    const domain = message.to.split("@")[1].toLowerCase();
    if (!PUBLIC_MAILBOXES.has(domain)) {
      assert.ok(registered.has(domain), `${message.id} : domaine absent du registre`);
    }
    assert.ok(["brouillon", "approuve", "envoye", "ecarte"].includes(message.status), `${message.id} : statut inconnu`);
  }
});

test("brouillons e-mail : chacun existe dans la file (aucun brouillon invisible)", () => {
  const queued = new Set(queue.map((m) => m.to.toLowerCase()));
  for (const draft of drafts.filter((d) => /e-mail/i.test(d.canal ?? ""))) {
    assert.ok(queued.has(draft.email.toLowerCase()), `${draft.domaine} : brouillon absent de file-attente.json`);
    assert.match(draft.statut, /brouillon/i, `${draft.domaine} : statut de brouillon attendu`);
  }
});

test("brouillons vague 5 : statuts, domaines et file cohérents", () => {
  assert.ok(draftsVague5.length > 0, "aucun brouillon vague 5");
  const registered = new Set(registry.map((r) => r.domaine.toLowerCase()));
  const queued = new Set(queue.map((m) => m.to.toLowerCase()));
  for (const draft of draftsVague5) {
    assert.match(draft.statut, /^Brouillon/i, `${draft.domaine} : le statut doit rester un brouillon`);
    assert.ok(registered.has(draft.domaine.toLowerCase()), `${draft.domaine} : domaine absent du registre`);
    assert.ok(draft.page_ciblee.startsWith("http"), `${draft.domaine} : page cible manquante`);
    if (/e-mail/i.test(draft.canal)) {
      assert.ok(queued.has(draft.email.toLowerCase()), `${draft.domaine} : brouillon e-mail absent de la file`);
    }
  }
});

test("stats.json : les compteurs correspondent aux fichiers", () => {
  assert.equal(stats.domaines, registry.length, "nombre de domaines divergent");
  assert.equal(stats.qualifies, registry.filter((r) => /^Qualifié/i.test(r.statut)).length, "qualifiés divergents");
  assert.equal(stats.brouillonsVague3, drafts.length, "brouillons divergents");
  assert.equal(stats.contactsAvecAdresse, contacts.length, "contacts divergents");
  assert.equal(stats.backlinksVerifies, 0, "aucun backlink ne doit être compté sans vérification");
});
