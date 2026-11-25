import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  classifyObservation,
  csvCell,
  detectParrainioLinks,
  detectRedirectCandidates,
  extractSitemapUrls,
  linkOrigin,
  loadCampaign,
  normalizeUrl,
  observePage,
  parseRobots,
  readJsonl,
  renderReportMarkdown,
  sanitizeCandidateUrl,
  robotsAllows,
  runCheck,
  upsertVerifiedRows,
  lastObservationByPage,
} from "../scripts/netlinking-check-backlinks.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name) => fs.readFileSync(path.join(HERE, "fixtures", "netlinking", name), "utf8");
const DOMAIN = "annuaire-test.fr";

/* ---------------------------------------------------------------- 1 à 7 : détection */

test("1. lien direct vers l'accueil de Parrainio", () => {
  const links = detectParrainioLinks(fixture("link-direct.html"), `https://${DOMAIN}/`);
  assert.equal(links.length, 1);
  assert.equal(links[0].destination, "https://parrainio.fr");
  assert.equal(links[0].rel, "(absent)");
  assert.equal(links[0].nofollow, false);
});

test("2. lien vers www.parrainio.fr", () => {
  const links = detectParrainioLinks(fixture("link-www.html"), `https://${DOMAIN}/`);
  assert.equal(links.length, 1);
  assert.equal(links[0].destination, "https://www.parrainio.fr/classement-primes-parrainage");
});

test("3. lien vers une page interne (fragment ignoré)", () => {
  const links = detectParrainioLinks(fixture("link-internal.html"), `https://${DOMAIN}/article`);
  assert.equal(links.length, 1);
  assert.equal(links[0].destination, "https://parrainio.fr/classement-primes-parrainage");
});

test("4. attribut nofollow conservé", () => {
  const [link] = detectParrainioLinks(fixture("link-nofollow.html"), `https://${DOMAIN}/`);
  assert.equal(link.nofollow, true);
  assert.match(link.rel, /nofollow/);
});

test("5. attribut sponsored conservé", () => {
  const [link] = detectParrainioLinks(fixture("link-sponsored.html"), `https://${DOMAIN}/`);
  assert.equal(link.sponsored, true);
  assert.equal(link.nofollow, false);
});

test("6. mention en texte brut sans lien HTML : aucun backlink", () => {
  const links = detectParrainioLinks(fixture("mention-text.html"), `https://${DOMAIN}/`);
  assert.equal(links.length, 0);
});

test("7. domaines sosies rejetés", () => {
  const links = detectParrainioLinks(fixture("lookalike.html"), `https://${DOMAIN}/`);
  assert.equal(links.length, 0);
});

/* ------------------------------------------------------------------ 8 : redirections */

test("8. redirection vers une mauvaise destination non comptée, bonne redirection comptée", async () => {
  const pageNoLink = fixture("redirect-bad.html");
  const pageGood = fixture("redirect-good.html");

  const fetchImpl = async (url) => {
    if (url.endsWith("/redirect-bad")) {
      return { status: 200, finalUrl: "https://exemple.fr/autre-chose", text: "<html>autre</html>", contentType: "text/html" };
    }
    if (url.endsWith("/redirect-good")) {
      return { status: 200, finalUrl: "https://parrainio.fr/classement-primes-parrainage", text: "<html>ok</html>", contentType: "text/html" };
    }
    if (url === `https://${DOMAIN}/mauvais`) {
      return { status: 200, finalUrl: `https://${DOMAIN}/mauvais`, text: pageNoLink, contentType: "text/html" };
    }
    return { status: 200, finalUrl: `https://${DOMAIN}/bon`, text: pageGood, contentType: "text/html" };
  };

  const bad = await observePage(`https://${DOMAIN}/mauvais`, { fetchImpl });
  assert.equal(bad.kind, "absent");

  const good = await observePage(`https://${DOMAIN}/bon`, { fetchImpl });
  assert.equal(good.kind, "present");
  assert.equal(good.links[0].destination, "https://parrainio.fr/classement-primes-parrainage");
  assert.equal(good.links[0].anchor, "(redirection)");
});

test("8b. candidats de redirection repérés sans requête", () => {
  const html = '<a href="/redirect-x">a</a><a href="https://bit.ly/abc">b</a><a href="https://ailleurs.fr/page">c</a>';
  const candidates = detectRedirectCandidates(html, `https://${DOMAIN}/`);
  assert.equal(candidates.length, 2);
});

/* ------------------------------------------------------------- 9 et 10 : statuts */

test("9. page 404 classée inaccessible, jamais « disparue »", async () => {
  const obs = await observePage(`https://${DOMAIN}/absente`, {
    fetchImpl: async () => ({ status: 404, finalUrl: `https://${DOMAIN}/absente`, text: "", contentType: "text/html" }),
  });
  assert.equal(obs.kind, "unreachable");
  assert.equal(classifyObservation({ kind: "present" }, obs).state, "inaccessible");
  assert.equal(classifyObservation({ kind: "present" }, obs).indeterminate, true);
});

test("10. page bloquée (403) classée bloquée", async () => {
  const obs = await observePage(`https://${DOMAIN}/protegee`, {
    fetchImpl: async () => ({ status: 403, finalUrl: `https://${DOMAIN}/protegee`, text: "Forbidden", contentType: "text/html" }),
  });
  assert.equal(obs.kind, "blocked");
  assert.equal(classifyObservation({ kind: "present" }, obs).state, "bloque");
});

test("10b. page de challenge Cloudflare traitée comme bloquée", async () => {
  const obs = await observePage(`https://${DOMAIN}/`, {
    fetchImpl: async () => ({
      status: 200,
      finalUrl: `https://${DOMAIN}/`,
      text: "<html><title>Just a moment...</title><body>Checking your browser</body></html>",
      contentType: "text/html",
    }),
  });
  assert.equal(obs.kind, "blocked");
});

/* ------------------------------------------------- 11, 12 et 14 : comparaison */

test("11. page déjà contrôlée sans changement : état inchange", () => {
  const current = { kind: "present", links: [{ destination: "https://parrainio.fr", anchor: "Parrainio", rel: "(absent)" }] };
  const previous = { kind: "present", links: current.links };
  assert.equal(classifyObservation(previous, current).state, "inchange");
});

test("11b. lien modifié détecté", () => {
  const previous = { kind: "present", links: [{ destination: "https://parrainio.fr", anchor: "Parrainio", rel: "(absent)" }] };
  const current = { kind: "present", links: [{ destination: "https://parrainio.fr", anchor: "classement", rel: "nofollow" }] };
  assert.equal(classifyObservation(previous, current).state, "modifie");
});

test("12. lien disparu sur page accessible", () => {
  const previous = { kind: "present", links: [{ destination: "https://parrainio.fr" }] };
  assert.equal(classifyObservation(previous, { kind: "absent", links: [] }).state, "disparu");
});

test("14. page inaccessible après un lien valide : indéterminée, pas disparue", () => {
  const previous = { kind: "present", links: [{ destination: "https://parrainio.fr" }] };
  for (const kind of ["blocked", "unreachable"]) {
    const result = classifyObservation(previous, { kind, links: [] });
    assert.equal(result.indeterminate, true);
    assert.notEqual(result.state, "disparu");
  }
});

/* --------------------------------------------------------- 13 : déduplication */

test("13. domaine présent dans plusieurs fichiers : un seul candidat", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nl-dedupe-"));
  const registry = path.join(dir, "base-prospection.csv");
  fs.writeFileSync(
    registry,
    "domaine;nom;url;page;contact;source;type_opportunite;score;modele;decouvert_le;contacte_le;statut;confirmation;reponse;backlink_url;motif;derniere_verif;prochaine_action\n" +
      `www.${DOMAIN};Test;https://${DOMAIN};https://${DOMAIN}/contact;;;Formulaire;12;;2026-10-20;2026-10-20;Formulaire soumis, confirmation observée;;;;;2026-10-20;\n`,
  );
  const contacts = path.join(dir, "contacts-email.csv");
  fs.writeFileSync(
    contacts,
    "domaine;nom;email;source_url;date_verification;type_contact;confiance;thematique;score;modele;objet;texte_pret_a_envoyer;statut;raison_non_envoi\n" +
      `${DOMAIN};Test;contact@${DOMAIN};https://${DOMAIN}/contact;2026-10-20;contact général;Confirmée;;12;;Objet;Texte;Brouillon prêt;\n`,
  );
  const actions = path.join(dir, "actions-manuelles.csv");
  fs.writeFileSync(
    actions,
    "site;domaine;url_action;type_blocage;motif;objet;texte_a_copier;champs;conditions_url;score;etat_tentative;prochaine_action;derniere_verif\n" +
      `Test;${DOMAIN};https://${DOMAIN}/contact;CAPTCHA;motif;objet;texte;champs;;12;aucune;ouvrir;2026-10-20\n`,
  );
  const campaign = loadCampaign({
    registry,
    contacts,
    drafts: path.join(dir, "absent.csv"),
    actions,
    relances: path.join(dir, "absent2.csv"),
    oppositions: path.join(dir, "absent3.csv"),
  });
  assert.equal(campaign.all.size, 1);
  assert.equal(campaign.selected.length, 1);
  assert.deepEqual([...campaign.all.get(DOMAIN).sources].sort(), [
    "actions-manuelles.csv",
    "base-prospection.csv",
    "contacts-email.csv",
  ]);
});

test("13b. opposition exclue de la sélection", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nl-opp-"));
  const registry = path.join(dir, "r.csv");
  fs.writeFileSync(
    registry,
    "domaine;nom;url;page;contact;source;type_opportunite;score;modele;decouvert_le;contacte_le;statut;confirmation;reponse;backlink_url;motif;derniere_verif;prochaine_action\n" +
      `oppose.fr;O;https://oppose.fr;https://oppose.fr/contact;;;x;10;;2026-10-20;2026-10-20;Formulaire soumis, confirmation observée;;;;;2026-10-20;\n`,
  );
  const oppositions = path.join(dir, "o.csv");
  fs.writeFileSync(oppositions, '"domaine";"nom";"date";"canal";"motif"\n"oppose.fr";"O";"2026-10-19";"site";"stop"\n');
  const campaign = loadCampaign({
    registry,
    contacts: path.join(dir, "a.csv"),
    drafts: path.join(dir, "b.csv"),
    actions: path.join(dir, "c.csv"),
    relances: path.join(dir, "d.csv"),
    oppositions,
  });
  assert.equal(campaign.selected.length, 0);
});

/* ----------------------------------------------------------- utilitaires divers */

test("robots.txt : Disallow respecté, Allow prioritaire sur motif plus long", () => {
  const rules = parseRobots(
    "User-agent: *\nDisallow: /prive\nAllow: /prive/public\nSitemap: https://exemple.fr/sitemap.xml\n",
  );
  assert.equal(robotsAllows(rules, "https://exemple.fr/prive/page"), false);
  assert.equal(robotsAllows(rules, "https://exemple.fr/prive/public/page"), true);
  assert.equal(robotsAllows(rules, "https://exemple.fr/article"), true);
});

test("robots.txt : joker et blocage total", () => {
  const rules = parseRobots("User-agent: *\nDisallow: /*.pdf$\nDisallow: /\n");
  assert.equal(robotsAllows(rules, "https://exemple.fr/doc.pdf"), false);
  assert.equal(robotsAllows(rules, "https://exemple.fr/page"), false);
});

test("sitemap : extraction bornée des <loc>", () => {
  const xml = `<?xml version="1.0"?><urlset>
    <url><loc>https://exemple.fr/parrainage</loc></url>
    <url><loc>https://exemple.fr/contact</loc></url>
  </urlset>`;
  assert.deepEqual(extractSitemapUrls(xml), ["https://exemple.fr/parrainage", "https://exemple.fr/contact"]);
  assert.equal(extractSitemapUrls(xml, 1).length, 1);
});

test("normalisation : slash, fragment, casse de l'hôte", () => {
  assert.equal(normalizeUrl("https://WWW.Parrainio.FR/"), "https://www.parrainio.fr");
  assert.equal(normalizeUrl("https://parrainio.fr/a/#x"), "https://parrainio.fr/a");
  assert.notEqual(normalizeUrl("https://parrainio.fr/A"), normalizeUrl("https://parrainio.fr/a"));
});

test("URL de registre annotée : la note libre est retirée", () => {
  assert.equal(
    sanitizeCandidateUrl("https://www.lesfinances.fr/contact (page invitant à proposer un partenariat)"),
    "https://www.lesfinances.fr/contact",
  );
  assert.equal(
    sanitizeCandidateUrl("https://finance-heros.fr/mentions-legales-cgu/%20(adresse publiée sous la forme « contact [arobase] »"),
    "https://finance-heros.fr/mentions-legales-cgu/",
  );
  assert.equal(sanitizeCandidateUrl("https://exemple.fr/article"), "https://exemple.fr/article");
  assert.equal(sanitizeCandidateUrl("pas une url"), "");
});

test("rapport markdown : compteurs et avertissement causal", () => {
  const md = renderReportMarkdown({
    startedAt: "2026-10-20T10:00:00Z",
    finishedAt: "2026-10-20T10:01:00Z",
    registryDomains: 368,
    candidates: 31,
    pagesFetched: 215,
    pagesWithLink: 0,
    newLinks: [],
    knownLinks: [],
    disappeared: [],
    noLinkPages: 215,
    blockedOrUnreachable: 8,
    indeterminateDomains: [DOMAIN, DOMAIN],
    preexisting: [],
    undetermined: [],
    verifiedRows: 0,
    verifiedAdded: 0,
    domains: [{ domain: DOMAIN, pages: 3, fetched: 2, unavailable: 1, withLink: 0, status: "indéterminé (contrôle impossible)" }],
  });
  assert.match(md, /Domaines dans le registre \| 368/);
  assert.match(md, /Nouveaux liens depuis le dernier contrôle \| 0/);
  assert.match(md, /seule une publication postérieure au contact/);
  // Le domaine indéterminé n'apparaît qu'une fois malgré un doublon dans le rapport.
  assert.equal(md.match(new RegExp(DOMAIN, "g")).length, 2);
});

test("origine d'un lien : préexistant, indéterminé ou nouveau", () => {
  // Le lien est présent au baseline, et le baseline précède le contact :
  // il ne peut pas être un effet de la campagne.
  assert.equal(
    linkOrigin({ baselineEntry: { linkPresent: true }, contactDate: "2026-10-25", baselineDate: "2026-10-20T10:00:00Z" }),
    "preexistant",
  );
  // Le baseline est postérieur au contact : impossible de trancher.
  assert.equal(
    linkOrigin({ baselineEntry: { linkPresent: true }, contactDate: "2026-10-01", baselineDate: "2026-10-20T10:00:00Z" }),
    "indetermine",
  );
  assert.equal(linkOrigin({ baselineEntry: { linkPresent: false }, contactDate: "2026-10-01", baselineDate: "2026-10-20" }), "nouveau");
});

test("fusion CSV : pas de doublon, historique conservé", () => {
  const entry = {
    domain: DOMAIN,
    pageUrl: `https://${DOMAIN}/article`,
    destination: "https://parrainio.fr",
    destinationFinale: "https://parrainio.fr",
    anchor: "Parrainio",
    rel: "(absent)",
    checkedAt: "2026-10-20T18:00:00Z",
    firstSeen: "2026-10-20T18:00:00Z",
    origin: "nouveau",
    httpStatus: 200,
    snippet: '<a href="https://parrainio.fr/">Parrainio</a>',
  };
  const first = upsertVerifiedRows([], [entry]);
  assert.equal(first.added, 1);
  const second = upsertVerifiedRows(first.rows, [{ ...entry, checkedAt: "2026-10-21T18:00:00Z" }]);
  assert.equal(second.added, 0);
  assert.equal(second.updated, 1);
  assert.equal(second.rows.length, 1);
  assert.equal(second.rows[0]["Date de vérification"], "2026-10-21");
});

test("csvCell échappe guillemets, points-virgules et retours à la ligne", () => {
  assert.equal(csvCell("a;b"), '"a;b"');
  assert.equal(csvCell('il dit "oui"'), '"il dit ""oui"""');
  assert.equal(csvCell("ligne1\nligne2"), '"ligne1\nligne2"');
});

/* --------------------------------------------------- intégration : cycle complet */

function makeCampaignDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nl-run-"));
  const paths = {
    registry: path.join(dir, "base-prospection.csv"),
    contacts: path.join(dir, "contacts-email.csv"),
    drafts: path.join(dir, "brouillons-email.csv"),
    actions: path.join(dir, "actions-manuelles.csv"),
    relances: path.join(dir, "relances-email.csv"),
    oppositions: path.join(dir, "oppositions.csv"),
    baseline: path.join(dir, "backlinks-baseline.jsonl"),
    observations: path.join(dir, "backlinks-observations.jsonl"),
    verifiedCsv: path.join(dir, "3-backlinks-verifies.csv"),
  };
  fs.writeFileSync(
    paths.registry,
    "domaine;nom;url;page;contact;source;type_opportunite;score;modele;decouvert_le;contacte_le;statut;confirmation;reponse;backlink_url;motif;derniere_verif;prochaine_action\n" +
      `${DOMAIN};Annuaire test;https://${DOMAIN};https://${DOMAIN}/parrainage;;;Ressource;14;;2026-10-19;2026-10-20;Formulaire soumis, confirmation observée;;;;;2026-10-20;\n`,
  );
  return { dir, paths };
}

/** Faux serveur : le contenu de /parrainage change selon l'étape. */
function makeFetch(stage) {
  return async (url) => {
    const bare = url.replace(/\/$/, "");
    if (bare.endsWith("/robots.txt")) return { status: 404, finalUrl: url, text: "", contentType: "text/plain" };
    if (bare.endsWith("/sitemap.xml") || bare.endsWith("/sitemap_index.xml"))
      return { status: 404, finalUrl: url, text: "", contentType: "text/xml" };
    if (bare === `https://${DOMAIN}`) return { status: 200, finalUrl: `https://${DOMAIN}/`, text: fixture("home-with-links.html"), contentType: "text/html" };
    if (bare.endsWith("/parrainage")) {
      if (stage === "error") throw new Error("ECONNRESET");
      if (stage === "blocked") return { status: 429, finalUrl: url, text: "Too many requests", contentType: "text/html" };
      if (stage === "gone") return { status: 200, finalUrl: url, text: fixture("no-link.html"), contentType: "text/html" };
      return { status: 200, finalUrl: url, text: fixture("link-direct.html"), contentType: "text/html" };
    }
    return { status: 404, finalUrl: url, text: "", contentType: "text/html" };
  };
}

test("cycle complet : baseline, observations, CSV idempotent, disparition, blocage", async () => {
  const { paths } = makeCampaignDir();
  const quiet = () => {};

  // 1) premier contrôle : lien constaté
  const first = await runCheck({ paths, fetchImpl: makeFetch("ok"), quiet: true, log: quiet, maxPages: 3, concurrency: 1 });
  assert.equal(first.newLinks.length, 1);
  assert.equal(first.verifiedRows, 1);
  const baseline = readJsonl(paths.baseline);
  assert.equal(baseline.length >= 1, true);
  assert.equal(baseline.some((b) => b.linkPresent), true);
  const observations1 = readJsonl(paths.observations);
  assert.equal(observations1.some((o) => o.kind === "present"), true);

  // 2) deuxième contrôle sans changement : aucun ajout
  const second = await runCheck({ paths, fetchImpl: makeFetch("ok"), quiet: true, log: quiet, maxPages: 3, concurrency: 1 });
  assert.equal(second.verifiedAdded, 0);
  assert.equal(second.verifiedRows, 1);
  assert.equal(second.knownLinks.length, 1);
  const baseline2 = readJsonl(paths.baseline);
  assert.equal(baseline2.length, baseline.length, "la baseline ne doit pas être réécrite");

  // 3) lien retiré sur une page accessible : disparition, ligne conservée
  const third = await runCheck({ paths, fetchImpl: makeFetch("gone"), quiet: true, log: quiet, maxPages: 3, concurrency: 1 });
  assert.equal(third.disappeared.length, 1);
  assert.equal(third.verifiedRows, 1);

  // 4) page bloquée : indéterminée, pas de disparition supplémentaire
  const fourth = await runCheck({ paths, fetchImpl: makeFetch("blocked"), quiet: true, log: quiet, maxPages: 3, concurrency: 1 });
  assert.equal(fourth.disappeared.length, 0);
  assert.equal(fourth.blockedOrUnreachable > 0, true);

  // 5) erreur réseau : observation conservée, pas de disparition
  const fifth = await runCheck({ paths, fetchImpl: makeFetch("error"), quiet: true, log: quiet, maxPages: 3, concurrency: 1 });
  assert.equal(fifth.disappeared.length, 0);

  const all = readJsonl(paths.observations);
  assert.equal(all.some((o) => o.kind === "present"), true, "l'historique valide est conservé");
  const last = lastObservationByPage(all);
  assert.equal(last.size >= 1, true);
});

test("migration : un CSV historique à 7 colonnes est conservé et complété", async () => {
  const { paths } = makeCampaignDir();
  fs.writeFileSync(
    paths.verifiedCsv,
    "Domaine source;URL source;URL destination;Ancre;Attribut SEO;Date de vérification;Preuve\n" +
      "ancien-site.fr;https://ancien-site.fr/page;https://parrainio.fr;ancien;(absent);2026-10-19;preuve historique\n",
  );
  await runCheck({ paths, fetchImpl: makeFetch("ok"), quiet: true, log: () => {}, maxPages: 3, concurrency: 1 });
  const lines = fs.readFileSync(paths.verifiedCsv, "utf8").trim().split(/\r?\n/);
  assert.equal(lines[0].split(";").length, 13);
  assert.match(lines[0], /destination_finale/);
  assert.equal(lines.length, 3, "en-tête + ancienne ligne conservée + nouvelle ligne");
  assert.match(lines[1], /ancien-site\.fr/);
  assert.match(lines[2], /annuaire-test\.fr/);
});

test("dry-run : aucune écriture, aucun réseau", async () => {
  const { dir, paths } = makeCampaignDir();
  let called = 0;
  const report = await runCheck({
    paths,
    dryRun: true,
    log: () => {},
    fetchImpl: async () => {
      called += 1;
      return { status: 200, finalUrl: "", text: "", contentType: "" };
    },
  });
  assert.equal(report.dryRun, true);
  assert.equal(called, 0);
  for (const file of [paths.baseline, paths.observations, paths.verifiedCsv]) {
    assert.equal(fs.existsSync(file), false, `${path.basename(file)} ne doit pas être créé`);
  }
  assert.equal(fs.existsSync(path.join(dir, "base-prospection.csv")), true);
});
