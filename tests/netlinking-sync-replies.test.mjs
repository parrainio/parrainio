import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  buildOutgoingIndex,
  checkImap,
  classifyReply,
  extractUrls,
  matchReply,
  normalizeSubject,
  syncReplies,
} from "../scripts/netlinking-sync-replies.mjs";
import { runCheck } from "../scripts/netlinking-check-backlinks.mjs";

const DOMAIN = "annuaire-test.fr";
const OUT_ID = "<out-1@parrainio.fr>";
const QUEUE = {
  campaign: "test",
  sender: { name: "Mathieu Morin", email: "parrainage@parrainio.fr", replyTo: "parrainage@parrainio.fr" },
  messages: [
    {
      id: "annuaire-test",
      site: "Annuaire Test",
      to: `contact@${DOMAIN}`,
      contactSource: `https://${DOMAIN}/contact`,
      addressVerified: "2026-10-20",
      template: 2,
      score: 12,
      priority: 2,
      status: "envoye",
      sentAt: "2026-10-20T10:00:00.000Z",
      messageId: OUT_ID,
      subject: "Une ressource complémentaire sur les primes de parrainage",
      body: "Bonjour, ... https://parrainio.fr",
    },
  ],
};
const JOURNAL = [
  {
    at: "2026-10-20T10:00:00.000Z",
    id: "annuaire-test",
    to: `contact@${DOMAIN}`,
    subject: "Une ressource complémentaire sur les primes de parrainage",
    messageId: OUT_ID,
    response: "250 queued TEST",
    accepted: [`contact@${DOMAIN}`],
    rejected: [],
    ok: true,
  },
];
const REGISTRY_HEADER =
  "domaine;nom;url;page;contact;source;type_opportunite;score;modele;decouvert_le;contacte_le;statut;confirmation;reponse;backlink_url;motif;derniere_verif;prochaine_action";
const registryRow = (extra = {}) => {
  const base = {
    domaine: DOMAIN,
    nom: "Annuaire Test",
    url: `https://${DOMAIN}`,
    page: `https://${DOMAIN}/contact`,
    contact: `contact@${DOMAIN}`,
    source: "test",
    type_opportunite: "annuaire",
    score: "12",
    modele: "2",
    decouvert_le: "2026-10-20",
    contacte_le: "2026-10-20",
    statut: "E-mail envoyé, accepté par le serveur SMTP",
    confirmation: "250 queued TEST",
    reponse: "",
    backlink_url: "",
    motif: "",
    derniere_verif: "2026-10-20",
    prochaine_action: "",
    ...extra,
  };
  return REGISTRY_HEADER.split(";").map((k) => base[k] ?? "").join(";");
};

const index = () =>
  buildOutgoingIndex({
    queue: QUEUE,
    journal: JOURNAL,
    registry: { header: REGISTRY_HEADER.split(";"), rows: [{ domaine: DOMAIN, contact: `contact@${DOMAIN}` }] },
  });

const email = (overrides = {}) => ({
  messageId: "<reply-1@mail.fr>",
  inReplyTo: "",
  references: "",
  headers: {},
  from: { name: "Rédaction", address: `contact@${DOMAIN}` },
  subject: "Re: Une ressource complémentaire sur les primes de parrainage",
  date: "2026-10-21T09:00:00.000Z",
  text: "",
  ...overrides,
});

const mime = ({ from, to = "parrainage@parrainio.fr", subject, messageId, inReplyTo, references, headers = {}, body = "" }) =>
  [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Date: Wed, 21 Oct 2026 09:00:00 +0000`,
    `Message-ID: ${messageId}`,
    ...(inReplyTo ? [`In-Reply-To: ${inReplyTo}`] : []),
    ...(references ? [`References: ${references}`] : []),
    ...Object.entries(headers).map(([k, v]) => `${k}: ${v}`),
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "",
    body,
  ].join("\r\n");

/* ------------------------------------------------------------ 1 à 4 : matching */

test("1. In-Reply-To établit une correspondance certaine", () => {
  const match = matchReply(email({ inReplyTo: OUT_ID }), index());
  assert.equal(match.confidence, "certaine");
  assert.equal(match.reason, "In-Reply-To");
  assert.equal(match.outgoing.domain, DOMAIN);
});

test("2. References établit aussi une correspondance certaine", () => {
  const match = matchReply(email({ references: `<autre@x.fr> ${OUT_ID}` }), index());
  assert.equal(match.confidence, "certaine");
  assert.equal(match.reason, "References");
});

test("3. objet modifié mais adresse connue : correspondance probable", () => {
  const match = matchReply(email({ subject: "Votre demande de partenariat" }), index());
  assert.equal(match.confidence, "probable");
  assert.equal(match.reason, "adresse expéditrice connue");
});

test("4. autre interlocuteur du même site, même objet : probable", () => {
  const match = matchReply(email({ from: { name: "Direction", address: `direction@${DOMAIN}` } }), index());
  assert.equal(match.confidence, "probable");
  assert.equal(match.reason, "domaine expéditeur + objet");
});

/* ------------------------------------------------------- 5 à 9 : classification */

test("5. réponse automatique d'absence", () => {
  const result = classifyReply(
    email({
      subject: "Absence du bureau",
      headers: { "auto-submitted": "auto-replied" },
      text: "Je suis absent jusqu'au 30 octobre.",
    }),
  );
  assert.equal(result.category, "absence");
  assert.equal(result.opposition, false);
});

test("6. refus explicite", () => {
  const result = classifyReply(email({ text: "Merci, mais nous ne sommes pas intéressés par ce type de contenu." }));
  assert.equal(result.category, "refus");
});

test("7. demande « stop » : opposition", () => {
  const result = classifyReply(email({ text: "Merci de ne plus me contacter, retirez-moi de votre liste." }));
  assert.equal(result.category, "stop");
  assert.equal(result.opposition, true);
});

test("8. échec de livraison", () => {
  const result = classifyReply(
    email({
      from: { name: "Mail Delivery", address: "mailer-daemon@ovh.net" },
      subject: "Undelivered Mail Returned to Sender",
      headers: { "content-type": "multipart/report; report-type=delivery-status" },
      text: "550 5.1.1 user unknown",
    }),
  );
  assert.equal(result.category, "echec_livraison");
});

test("9. proposition payante", () => {
  const result = classifyReply(email({ text: "Nous pouvons publier votre article pour 150 € HT." }));
  assert.equal(result.category, "payant");
  assert.equal(result.opposition, false);
});

/* --------------------------------------------------------- 10 à 13 : URL */

test("10. URL de publication extraite avec domaine du site", () => {
  const urls = extractUrls(`L'article est en ligne : https://${DOMAIN}/primes-parrainage/`, {
    campaignDomain: DOMAIN,
    confidence: "certaine",
  });
  assert.equal(urls.length, 1);
  assert.equal(urls[0].kind, "publication");
  assert.equal(urls[0].confidence, "certaine");
});

test("11. URL de contact seulement : pas une publication", () => {
  const urls = extractUrls(`Vous pouvez nous joindre via https://${DOMAIN}/contact/`, { campaignDomain: DOMAIN });
  assert.equal(urls[0].kind, "contact");
});

test("12. domaine sans rapport", () => {
  const urls = extractUrls("Voir https://exemple-medias.fr/dossier", { campaignDomain: DOMAIN });
  assert.equal(urls[0].kind, "sans_rapport");
});

test("13. URL suspecte (raccourcisseur / punycode)", () => {
  const urls = extractUrls("Lien : https://bit.ly/abc123 et https://xn--parrainio-4ya.fr/x", { campaignDomain: DOMAIN });
  assert.deepEqual(
    urls.map((u) => u.kind),
    ["suspecte", "suspecte"],
  );
});

/* ------------------------------------------- 14 à 20 : orchestration locale */

function workspace() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "replies-"));
  const paths = {
    queue: path.join(dir, "file-attente.json"),
    journal: path.join(dir, "journal.jsonl"),
    registry: path.join(dir, "base-prospection.csv"),
    oppositions: path.join(dir, "oppositions.csv"),
    contacts: path.join(dir, "contacts.csv"),
    replies: path.join(dir, "reponses-email.jsonl"),
    pages: path.join(dir, "pages-publication.jsonl"),
    state: path.join(dir, "state.json"),
    verified: path.join(dir, "3-backlinks-verifies.csv"),
  };
  fs.writeFileSync(paths.queue, JSON.stringify(QUEUE, null, 2));
  fs.writeFileSync(paths.journal, JOURNAL.map((j) => JSON.stringify(j)).join("\n") + "\n");
  fs.writeFileSync(paths.registry, `${REGISTRY_HEADER}\n${registryRow()}\n`);
  fs.writeFileSync(paths.oppositions, "domaine;nom;date;canal;motif\n");
  return paths;
}

function fakeImap({ messages = [], lock = {}, fail = null } = {}) {
  return {
    async connect() {
      if (fail) throw Object.assign(new Error(fail), { code: fail });
    },
    async list() {
      return [{ path: "INBOX" }];
    },
    async getMailboxLock(mailbox, options) {
      lock.mailbox = mailbox;
      lock.options = options;
      return {
        release() {
          lock.released = true;
        },
      };
    },
    mailbox: { exists: messages.length },
    async search() {
      return messages.map((m) => m.uid);
    },
    async fetchOne(uid, options) {
      const message = messages.find((m) => m.uid === uid);
      if (!message) return null;
      if (options.source) return { source: Buffer.from(message.mime) };
      return { envelope: { date: new Date(message.date), subject: message.subject } };
    },
    async logout() {
      lock.loggedOut = true;
    },
  };
}

test("14. publication promise : page enregistrée, aucun backlink", async () => {
  const paths = workspace();
  const lock = {};
  const messages = [
    {
      uid: 10,
      mime: mime({
        from: `Rédaction <contact@${DOMAIN}>`,
        subject: "Re: Une ressource complémentaire sur les primes de parrainage",
        messageId: "<reply-10@mail.fr>",
        inReplyTo: OUT_ID,
        body: "Merci, nous publierons votre article la semaine prochaine sur " + `https://${DOMAIN}/primes-parrainage/`,
      }),
    },
  ];
  const summary = await syncReplies({ paths, imapFactory: () => fakeImap({ messages, lock }), imapConfig: {} });
  assert.equal(summary.ok, true);
  assert.equal(summary.matched, 1);
  assert.equal(summary.byConfidence.certaine, 1);
  assert.equal(summary.pagesAdded, 1);

  const pages = fs.readFileSync(paths.pages, "utf8").trim().split("\n").map(JSON.parse);
  assert.equal(pages.length, 1);
  assert.equal(pages[0].status, "a_verifier");
  assert.equal(pages[0].url, `https://${DOMAIN}/primes-parrainage`);

  const reg = fs.readFileSync(paths.registry, "utf8");
  assert.match(reg, /Publication promise, non vérifiée/);
  assert.equal(fs.existsSync(paths.verified), false, "aucun CSV de backlink ne doit être créé");
});

test("15. demande « stop » : opposition écrite et statut mis à jour", async () => {
  const paths = workspace();
  const messages = [
    {
      uid: 11,
      mime: mime({
        from: `contact@${DOMAIN}`,
        subject: "Re: Une ressource complémentaire sur les primes de parrainage",
        messageId: "<reply-11@mail.fr>",
        references: OUT_ID,
        body: "Stop, ne me contactez plus.",
      }),
    },
  ];
  const summary = await syncReplies({ paths, imapFactory: () => fakeImap({ messages }), imapConfig: {} });
  assert.equal(summary.oppositionsAdded, 1);
  const csv = fs.readFileSync(paths.oppositions, "utf8");
  assert.match(csv, new RegExp(DOMAIN));
  assert.match(fs.readFileSync(paths.registry, "utf8"), /Opposition enregistrée/);
});

test("16. e-mail déjà traité : relance idempotente", async () => {
  const paths = workspace();
  const messages = [
    {
      uid: 12,
      mime: mime({
        from: `contact@${DOMAIN}`,
        subject: "Re: Une ressource complémentaire sur les primes de parrainage",
        messageId: "<reply-12@mail.fr>",
        inReplyTo: OUT_ID,
        body: "Merci pour votre message, nous allons étudier la proposition.",
      }),
    },
  ];
  await syncReplies({ paths, imapFactory: () => fakeImap({ messages }), imapConfig: {} });
  const state = JSON.parse(fs.readFileSync(paths.state, "utf8"));
  const second = await syncReplies({
    paths,
    imapFactory: () => fakeImap({ messages: messages.map((m) => ({ ...m, uid: m.uid + 1 })) }),
    imapConfig: {},
  });
  assert.equal(JSON.parse(fs.readFileSync(paths.state, "utf8")).lastUid >= state.lastUid, true);
  assert.equal(second.matched, 0, "le même Message-ID ne doit pas être compté deux fois");
  assert.equal(fs.readFileSync(paths.replies, "utf8").trim().split("\n").length, 1);
});

test("17. erreur IMAP temporaire : aucune écriture", async () => {
  const paths = workspace();
  const summary = await syncReplies({
    paths,
    imapFactory: () => fakeImap({ fail: "ETIMEDOUT" }),
    imapConfig: {},
  });
  assert.equal(summary.ok, false);
  assert.match(summary.error, /ETIMEDOUT|timeout/i);
  assert.equal(fs.existsSync(paths.replies), false);
  assert.equal(fs.existsSync(paths.state), false);
});

test("18. correspondance ambiguë : expéditeur d'un autre domaine", () => {
  const match = matchReply(
    email({
      from: { name: "Agence", address: "contact@agence-presse.fr" },
      subject: "Re: Une ressource complémentaire sur les primes de parrainage",
    }),
    index(),
  );
  assert.equal(match.confidence, "a_verifier");
});

test("19. lecture seule : boîte ouverte sans écriture de drapeau", async () => {
  const paths = workspace();
  const lock = {};
  await syncReplies({
    paths,
    imapFactory: () => fakeImap({ messages: [], lock }),
    imapConfig: {},
  });
  assert.equal(lock.options.readOnly, true);
  assert.equal(lock.released, true);
  assert.equal(lock.loggedOut, true);
});

test("20. --check-imap ne lit qu'un échantillon d'en-têtes", async () => {
  const lock = {};
  const messages = [
    { uid: 1, date: "2026-10-20T10:00:00Z", subject: "Un", mime: mime({ from: "a@b.fr", subject: "Un", messageId: "<a@b>" }) },
    { uid: 2, date: "2026-10-21T10:00:00Z", subject: "Deux", mime: mime({ from: "a@b.fr", subject: "Deux", messageId: "<b@b>" }) },
  ];
  const result = await checkImap({ imapFactory: () => fakeImap({ messages, lock }), imapConfig: {}, limit: 1 });
  assert.equal(result.ok, true);
  assert.equal(result.sample.length, 1);
  assert.equal(lock.options.readOnly, true);
});

test("21. dry-run : aucune écriture", async () => {
  const paths = workspace();
  const messages = [
    {
      uid: 13,
      mime: mime({
        from: `contact@${DOMAIN}`,
        subject: "Re: Une ressource complémentaire sur les primes de parrainage",
        messageId: "<reply-13@mail.fr>",
        inReplyTo: OUT_ID,
        body: "Nous publions votre article ici : " + `https://${DOMAIN}/article/`,
      }),
    },
  ];
  const summary = await syncReplies({
    paths,
    dryRun: true,
    imapFactory: () => fakeImap({ messages }),
    imapConfig: {},
  });
  assert.equal(summary.pagesAdded, 1);
  assert.equal(fs.existsSync(paths.pages), false);
  assert.equal(fs.existsSync(paths.replies), false);
  assert.equal(fs.existsSync(paths.state), false);
});

test("25. échec de livraison : statut « Tentative non confirmée »", async () => {
  const paths = workspace();
  const messages = [
    {
      uid: 14,
      mime: mime({
        from: "Mail Delivery System <mailer-daemon@ovh.net>",
        subject: "Undelivered Mail Returned to Sender",
        messageId: "<bounce-14@ovh.net>",
        headers: { "content-type": "multipart/report; report-type=delivery-status", "x-failed-recipients": `contact@${DOMAIN}` },
        body: `Votre message à contact@${DOMAIN} n'a pas pu être remis. 550 5.1.1 user unknown`,
      }),
    },
  ];
  const summary = await syncReplies({ paths, imapFactory: () => fakeImap({ messages }), imapConfig: {} });
  assert.equal(summary.categories.echec_livraison, 1);
  const reg = fs.readFileSync(paths.registry, "utf8");
  assert.match(reg, /Tentative non confirmée/);
  assert.match(reg, /Adresse invalide/);
});

test("26. paramètres de campagne retirés de l'URL de publication", () => {
  const urls = extractUrls(`https://${DOMAIN}/article/?utm_source=mail&utm_campaign=x&fbclid=abc`, {
    campaignDomain: DOMAIN,
  });
  assert.equal(urls[0].normalizedUrl, `https://${DOMAIN}/article`);
});

test("22. normalisation des sujets de réponse", () => {
  assert.equal(normalizeSubject("RE: Re: Fwd:  Une ressource "), "une ressource");
});

/* --------------------------------------- intégration avec le vérificateur */

function checkWorkspace({ publicationUrl, html }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "check-pub-"));
  const paths = {
    registry: path.join(dir, "base-prospection.csv"),
    contacts: null,
    drafts: null,
    actions: null,
    relances: null,
    oppositions: path.join(dir, "oppositions.csv"),
    baseline: path.join(dir, "baseline.jsonl"),
    observations: path.join(dir, "observations.jsonl"),
    verifiedCsv: path.join(dir, "verified.csv"),
    publicationPages: path.join(dir, "pages-publication.jsonl"),
  };
  fs.writeFileSync(paths.registry, `${REGISTRY_HEADER}\n${registryRow()}\n`);
  fs.writeFileSync(paths.oppositions, "domaine;nom;date;canal;motif\n");
  fs.writeFileSync(
    paths.publicationPages,
    JSON.stringify({ domain: DOMAIN, url: publicationUrl, status: "a_verifier" }) + "\n",
  );
  const fetchImpl = async (url) => {
    if (String(url).includes("robots.txt") || String(url).includes("sitemap")) {
      return { status: 404, finalUrl: url, text: "", contentType: "text/plain" };
    }
    if (String(url).startsWith(publicationUrl)) {
      return { status: 200, finalUrl: publicationUrl, text: html, contentType: "text/html" };
    }
    return { status: 200, finalUrl: url, text: "<html><body>accueil</body></html>", contentType: "text/html" };
  };
  return { paths, fetchImpl };
}

test("23. page publiée sans lien : aucun backlink compté", async () => {
  const url = `https://${DOMAIN}/article/`;
  const { paths, fetchImpl } = checkWorkspace({ publicationUrl: url, html: "<html><body><p>Article sans lien.</p></body></html>" });
  const report = await runCheck({ paths, fetchImpl, maxPages: 1, quiet: true, report: false, useRobots: false });
  assert.equal(report.pagesWithLink, 0);
  assert.equal(report.noLinkPages, 1);
  assert.equal(report.verifiedAdded, 0);
});

test("24. page publiée avec lien réel : backlink vérifié", async () => {
  const url = `https://${DOMAIN}/article/`;
  const html = `<html><body><a href="https://parrainio.fr/classement-primes-parrainage">notre classement</a></body></html>`;
  const { paths, fetchImpl } = checkWorkspace({ publicationUrl: url, html });
  const report = await runCheck({ paths, fetchImpl, maxPages: 1, quiet: true, report: false, useRobots: false });
  assert.equal(report.pagesWithLink, 1);
  assert.equal(report.verifiedAdded, 1);
  const csv = fs.readFileSync(paths.verifiedCsv, "utf8");
  assert.match(csv, /parrainio\.fr\/classement-primes-parrainage/);
  assert.match(csv, new RegExp(DOMAIN));
});

/* ------------------------------------------- 27 à 29 : rattrapage historique */

test("27. --backfill traite les messages antérieurs sans reculer le curseur principal", async () => {
  const paths = workspace();
  fs.writeFileSync(paths.state, JSON.stringify({ lastUid: 651, lastRun: "2026-10-20T10:00:00.000Z" }));
  const messages = [
    { uid: 600, mime: mime({ from: `Rédaction <contact@${DOMAIN}>`, subject: "Re: Une ressource complémentaire sur les primes de parrainage", messageId: "<back-600@mail.fr>", inReplyTo: OUT_ID, body: "Merci, je regarde." }) },
    { uid: 601, mime: mime({ from: `Rédaction <contact@${DOMAIN}>`, subject: "Re: Une ressource complémentaire sur les primes de parrainage", messageId: "<back-601@mail.fr>", inReplyTo: OUT_ID, body: "Bien reçu." }) },
  ];

  const first = await syncReplies({ paths, backfill: true, limit: 1, imapFactory: () => fakeImap({ messages }), imapConfig: {} });
  assert.equal(first.examined, 1);
  assert.equal(first.matched, 1, "le message le plus récent du rattrapage est traité en premier");
  let state = JSON.parse(fs.readFileSync(paths.state, "utf8"));
  assert.equal(state.lastUid, 651, "le curseur principal ne doit pas bouger");
  assert.equal(state.backfill.cursorUid, 601);
  assert.equal(state.backfill.remaining, 1);

  const second = await syncReplies({ paths, backfill: true, limit: 1, imapFactory: () => fakeImap({ messages }), imapConfig: {} });
  assert.equal(second.examined, 1);
  state = JSON.parse(fs.readFileSync(paths.state, "utf8"));
  assert.equal(state.lastUid, 651);
  assert.equal(state.backfill.cursorUid, 600);
  assert.equal(state.backfill.remaining, 0);
  assert.equal(fs.readFileSync(paths.replies, "utf8").trim().split("\n").length, 2);
});

test("28. --backfill est idempotent : un second passage ne duplique rien", async () => {
  const paths = workspace();
  fs.writeFileSync(paths.state, JSON.stringify({ lastUid: 651 }));
  const messages = [
    { uid: 500, mime: mime({ from: `Rédaction <contact@${DOMAIN}>`, subject: "Re: Une ressource complémentaire sur les primes de parrainage", messageId: "<back-500@mail.fr>", inReplyTo: OUT_ID, body: "Merci pour votre message." }) },
  ];
  const run = () =>
    syncReplies({ paths, backfill: true, limit: 5, imapFactory: () => fakeImap({ messages }), imapConfig: {} });
  const first = await run();
  assert.equal(first.matched, 1);
  const again = await run();
  assert.equal(again.examined, 0, "le curseur de rattrapage empêche de réexaminer les mêmes UID");
  assert.equal(again.matched, 0);
  assert.equal(fs.readFileSync(paths.replies, "utf8").trim().split("\n").length, 1);
});

test("29. message d'un domaine du registre sans envoi identifié : correspondance incertaine, statut intact", async () => {
  const paths = workspace();
  const messages = [
    { uid: 700, mime: mime({ from: `Newsletter <newsletter@${DOMAIN}>`, subject: "Nos nouveautés de la semaine", messageId: "<uncertain-700@mail.fr>", body: "Au sommaire cette semaine…" }) },
  ];
  const summary = await syncReplies({ paths, imapFactory: () => fakeImap({ messages }), imapConfig: {} });
  assert.equal(summary.uncertain, 1);
  assert.equal(summary.byConfidence.a_verifier, 1);
  const reply = JSON.parse(fs.readFileSync(paths.replies, "utf8").trim().split("\n").at(-1));
  assert.equal(reply.category, "correspondance_incertaine");
  assert.equal(reply.confidence, "a_verifier");
  assert.match(fs.readFileSync(paths.registry, "utf8"), /E-mail envoyé, accepté par le serveur SMTP/);
  assert.equal(fs.existsSync(paths.verified), false);
});

test("30. une adresse grand public ne sert jamais de domaine de site", async () => {
  const paths = workspace();
  const dup = fs.readFileSync(paths.registry, "utf8").split("\n");
  // Le registre contient une boîte Gmail : elle ne doit pas transformer tout
  // message Gmail en « correspondance incertaine ».
  fs.writeFileSync(paths.registry, dup.join("\n").replace(`${DOMAIN};`, `gmail.com;Boîte perso;`) + "\n");
  const messages = [
    { uid: 800, mime: mime({ from: "Quelqu'un <quelquun@gmail.com>", subject: "Photos de vacances", messageId: "<perso-800@mail.fr>", body: "Bonjour, voici les photos." }) },
  ];
  const summary = await syncReplies({ paths, imapFactory: () => fakeImap({ messages }), imapConfig: {} });
  assert.equal(summary.matched, 0);
  assert.equal(summary.uncertain, 0);
  assert.equal(fs.existsSync(paths.replies), false);
});
