import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";

import { runCheck } from "../scripts/netlinking-check-backlinks.mjs";

/**
 * Chaîne complète « page de publication → lien HTML constaté », servie par un
 * serveur HTTP local contrôlé. `SITE` est un nom logique : le fetch injecté le
 * réécrit vers 127.0.0.1, ce qui garde des URL réalistes sans sortir du poste.
 */
const SITE = "publication-test.example";
const REGISTRY_HEADER =
  "domaine;nom;url;page;contact;source;type_opportunite;score;modele;decouvert_le;contacte_le;statut;confirmation;reponse;backlink_url;motif;derniere_verif;prochaine_action";

const PAGES = {
  "/article": `<html><body><article><p>Notre sélection.</p>
    <a href="https://parrainio.fr/classement-primes-parrainage">les primes de parrainage</a>
  </article></body></html>`,
  "/sans-lien": `<html><body><p>Article sans aucun lien sortant.</p></body></html>`,
  "/autre-domaine": `<html><body>
    <a href="https://exemple-medias.fr/dossier">un autre média</a>
  </body></html>`,
};

let server;
let port;
let base;
let closedPort;

before(async () => {
  server = http.createServer((req, res) => {
    const pathname = new URL(req.url, "http://x").pathname.replace(/\/+$/, "") || "/";
    const html = PAGES[pathname];
    if (!html) {
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      res.end("<html><body>absente</body></html>");
      return;
    }
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(html);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  port = server.address().port;
  base = `http://${SITE}:${port}`;
  // Port fermé : sert à produire une indisponibilité réseau réelle.
  const probe = http.createServer(() => {});
  await new Promise((resolve) => probe.listen(0, "127.0.0.1", resolve));
  closedPort = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

function workspace(pages) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "publication-chain-"));
  const paths = {
    registry: path.join(dir, "base-prospection.csv"),
    contacts: null,
    drafts: null,
    actions: null,
    relances: null,
    oppositions: path.join(dir, "oppositions.csv"),
    baseline: path.join(dir, "baseline.jsonl"),
    observations: path.join(dir, "observations.jsonl"),
    verifiedCsv: path.join(dir, "backlinks-verifies.csv"),
    publicationPages: path.join(dir, "pages-publication.jsonl"),
  };
  fs.writeFileSync(paths.registry, `${REGISTRY_HEADER}\n`);
  fs.writeFileSync(paths.oppositions, "domaine;nom;date;canal;motif\n");
  fs.writeFileSync(
    paths.publicationPages,
    pages.map((url) => JSON.stringify({ domain: SITE, url, status: "a_verifier", source: "email" })).join("\n") + "\n",
  );
  return paths;
}

/** Réécrit l'hôte logique vers le serveur local, sans masquer les erreurs. */
const localFetch = (counter) => async (url, { timeout = 5000 } = {}) => {
  if (counter) counter.calls += 1;
  const target = String(url).replace(`http://${SITE}:${port}`, `http://127.0.0.1:${port}`);
  const res = await fetch(target, { signal: AbortSignal.timeout(timeout) });
  const text = await res.text();
  return { status: res.status, finalUrl: url, text, contentType: res.headers.get("content-type") ?? "" };
};

const check = (paths, opts = {}) =>
  runCheck({
    paths,
    fetchImpl: localFetch(opts.counter),
    publicationOnly: true,
    useRobots: false,
    quiet: true,
    report: false,
    concurrency: 1,
    ...opts,
  });

/* ------------------------------------------------------------ scénarios */

test("1. lien réel vers Parrainio : constaté et enregistré", async () => {
  const paths = workspace([`${base}/article`]);
  const report = await check(paths);
  assert.equal(report.publicationResults.length, 1);
  assert.equal(report.publicationResults[0].status, "lien Parrainio constaté");
  assert.equal(report.publicationResults[0].httpStatus, 200);
  assert.equal(report.pagesWithLink, 1);
  assert.equal(report.verifiedAdded, 1);
  const csv = fs.readFileSync(paths.verifiedCsv, "utf8");
  assert.match(csv, /parrainio\.fr\/classement-primes-parrainage/);
  assert.equal(report.registryUpdated, 0, "aucune ligne de registre inventée pour un domaine absent");
});

test("2. page accessible sans lien : aucun backlink compté", async () => {
  const paths = workspace([`${base}/sans-lien`]);
  const report = await check(paths);
  assert.equal(report.publicationResults[0].status, "accessible sans lien");
  assert.equal(report.pagesWithLink, 0);
  assert.equal(report.verifiedAdded, 0);
  assert.equal(report.noLinkPages, 1);
  assert.equal(fs.readFileSync(paths.verifiedCsv, "utf8").trim().split("\n").length, 1, "en-tête seul, aucune ligne");
});

test("3. page qui renvoie vers un autre domaine : distinguée d'une page vide", async () => {
  const paths = workspace([`${base}/autre-domaine`]);
  const report = await check(paths);
  const result = report.publicationResults[0];
  assert.equal(result.status, "sans lien Parrainio (liens vers d'autres domaines)");
  assert.deepEqual(result.externalHosts, ["exemple-medias.fr"]);
  assert.equal(report.verifiedAdded, 0);
  // L'observation conserve ce qui a été vu, sans conclure à un backlink.
  const observation = JSON.parse(fs.readFileSync(paths.observations, "utf8").trim().split("\n")[0]);
  assert.equal(observation.linkPresent, false);
  assert.deepEqual(observation.externalHosts, ["exemple-medias.fr"]);
});

test("4. page absente (404) : statut inaccessible, jamais « lien disparu »", async () => {
  const paths = workspace([`${base}/page-supprimee`]);
  const report = await check(paths);
  assert.equal(report.publicationResults[0].status, "inaccessible");
  assert.equal(report.publicationResults[0].httpStatus, 404);
  assert.equal(report.blockedOrUnreachable, 1);
  assert.equal(report.disappeared.length, 0);
  assert.equal(report.verifiedAdded, 0);
});

test("5. erreur réseau réelle : indéterminé, pas un backlink perdu", async () => {
  const paths = workspace([`http://${SITE}:${closedPort}/article`]);
  const report = await check(paths);
  assert.equal(report.publicationResults[0].status, "inaccessible");
  assert.equal(report.publicationResults[0].httpStatus, 0);
  assert.match(report.publicationResults[0].error ?? "", /ECONNREFUSED|fetch failed|connect/i);
  assert.equal(report.disappeared.length, 0);
});

test("6. URL suspecte (raccourcisseur) : consignée sans être ouverte", async () => {
  const counter = { calls: 0 };
  const paths = workspace(["https://bit.ly/3xAbCd"]);
  const report = await check(paths, { counter });
  assert.equal(counter.calls, 0, "aucune requête vers un raccourcisseur");
  assert.equal(report.publicationResults[0].status, "suspecte");
  assert.equal(report.pagesFetched, 0);
});

test("7. contrôle répété : même page, même lien, aucune ligne dupliquée", async () => {
  const paths = workspace([`${base}/article`]);
  const first = await check(paths);
  const second = await check(paths);
  assert.equal(first.verifiedAdded, 1);
  assert.equal(second.publicationResults[0].status, "lien Parrainio constaté");
  assert.equal(second.publicationResults[0].comparison, "inchange");
  const rows = fs.readFileSync(paths.verifiedCsv, "utf8").trim().split("\n");
  assert.equal(rows.length, 2, "en-tête + une seule ligne de backlink");
  assert.equal(second.verifiedRows, 1);
});
