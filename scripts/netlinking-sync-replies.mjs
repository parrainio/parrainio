#!/usr/bin/env node
/**
 * netlinking-sync-replies.mjs — relève IMAP en lecture seule des réponses reçues.
 *
 * Objectif : transformer les réponses à la campagne en données exploitables :
 *   - rapprochement avec les messages sortants (Message-ID, In-Reply-To, References) ;
 *   - classification (acceptation, refus, stop, absence, échec, paiement…) ;
 *   - extraction des URL de publication, sans les ouvrir ;
 *   - écriture des pages à vérifier pour `netlinking-check-backlinks.mjs`.
 *
 * Garanties :
 *   - la boîte est ouverte en lecture seule (`readOnly: true`) ;
 *   - aucun drapeau n'est modifié, aucun message déplacé, supprimé ou envoyé ;
 *   - seuls en-têtes et corps des messages retenus sont lus ;
 *   - aucun contenu d'e-mail n'est écrit dans les rapports ;
 *   - le mot de passe n'est jamais affiché ni journalisé.
 *
 * Usage :
 *   node scripts/netlinking-sync-replies.mjs --check-imap
 *   node scripts/netlinking-sync-replies.mjs --dry-run --limit 10
 *   node scripts/netlinking-sync-replies.mjs --sync
 *   node scripts/netlinking-sync-replies.mjs --sync --verify
 *   node scripts/netlinking-sync-replies.mjs --backfill --limit 10
 *   node scripts/netlinking-sync-replies.mjs --report
 *
 * `--backfill` traite les messages antérieurs au curseur principal, du plus
 * récent au plus ancien, sans jamais le faire reculer : un curseur distinct
 * (`backfill.cursorUid`) rend le rattrapage reprenable et idempotent.
 * `--from-uid N` fixe la borne haute du premier rattrapage (par défaut le
 * curseur principal), pour ne pas réexaminer des UID déjà traités.
 *
 * Variables : IMAP_HOST (défaut ssl0.ovh.net), IMAP_PORT (993), IMAP_USER,
 * IMAP_PASSWORD ; à défaut, SMTP_USER / SMTP_PASSWORD de la même boîte sont
 * réutilisés. `.env.local` est lu localement si une variable manque.
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { normalizeDomain, normalizeUrl } from "./netlinking-check-backlinks.mjs";

export const CAMPAIGN_START = "2026-10-19";

export const DEFAULT_PATHS = {
  queue: "docs/netlinking/campagne-email/file-attente.json",
  journal: "docs/netlinking/campagne-email/journal-envois.jsonl",
  registry: "docs/netlinking/base-prospection.csv",
  oppositions: "docs/netlinking/oppositions.csv",
  contacts: "docs/netlinking/contacts-email.csv",
  replies: "docs/netlinking/donnees/reponses-email.jsonl",
  pages: "docs/netlinking/donnees/pages-publication.jsonl",
  state: "docs/netlinking/donnees/replies-sync-state.json",
  verified: "docs/netlinking/3-backlinks-verifies.csv",
};

/* ----------------------------------------------------------------- congig */

/** Lit `.env.local` sans jamais afficher les valeurs. */
export function loadLocalEnv(file = ".env.local", env = process.env) {
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (env[m[1]] === undefined) env[m[1]] = value;
  }
  return env;
}

export function loadImapConfig(env = process.env) {
  const config = {
    host: (env.IMAP_HOST || "ssl0.ovh.net").trim(),
    port: Number(env.IMAP_PORT || 993),
    secure: true,
    user: (env.IMAP_USER || env.SMTP_USER || "").trim(),
    password: env.IMAP_PASSWORD || env.SMTP_PASSWORD || "",
  };
  const missing = [];
  if (!config.user) missing.push("IMAP_USER (ou SMTP_USER)");
  if (!config.password) missing.push("IMAP_PASSWORD (ou SMTP_PASSWORD)");
  if (!Number.isInteger(config.port) || config.port <= 0 || config.port > 65535) missing.push("IMAP_PORT");
  return { ...config, missing };
}

export const maskEmail = (value) => String(value || "").replace(/^(.{2}).*(@.*)$/, "$1***$2");

/* ------------------------------------------------------------------- CSV */

function writeCsv(file, header, rows) {
  const cell = (v) => {
    const s = String(v ?? "");
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  fs.writeFileSync(file, `${header.map(cell).join(";")}\n${rows.map((r) => header.map((h) => cell(r[h])).join(";")).join("\n")}\n`);
}

function readCsvRows(file) {
  if (!fs.existsSync(file)) return { header: [], rows: [] };
  const content = fs.readFileSync(file, "utf8");
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
      cur = "";
      rows.push(row);
      row = [];
    } else if (ch !== "\r") cur += ch;
  }
  if (cur || row.length) {
    row.push(cur);
    rows.push(row);
  }
  const [header = [], ...body] = rows.filter((r) => r.length > 1);
  return { header, rows: body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""]))) };
}

function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line)];
      } catch {
        return [];
      }
    });
}

function appendJsonl(file, entries) {
  if (!entries.length) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, entries.map((e) => JSON.stringify(e)).join("\n") + "\n");
}

/* ------------------------------------------------------- rapprochement */

/** Retire les préfixes de réponse et normalise le sujet. */
export function normalizeSubject(subject) {
  let s = String(subject ?? "").trim();
  for (let i = 0; i < 4; i += 1) {
    const next = s.replace(/^\s*(re|fw|fwd|tr|aw|wg)\s*(\[\d+\])?\s*:\s*/i, "").replace(/^\s*\[[^\]]{1,40}\]\s*/, "");
    if (next === s) break;
    s = next.trim();
  }
  return s.replace(/\s+/g, " ").toLowerCase();
}

/**
 * Fournisseurs de messagerie grand public : une adresse `@gmail.com` ne dit
 * rien du site contacté. Ces domaines ne servent donc jamais de clé de
 * rapprochement (sinon toute la boîte Gmail d'un contact serait assimilée à un
 * site de la campagne).
 */
export const FREE_MAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.fr",
  "yahoo.com",
  "hotmail.fr",
  "hotmail.com",
  "outlook.fr",
  "outlook.com",
  "live.fr",
  "live.com",
  "msn.com",
  "orange.fr",
  "wanadoo.fr",
  "free.fr",
  "laposte.net",
  "sfr.fr",
  "bbox.fr",
  "icloud.com",
  "me.com",
  "protonmail.com",
  "proton.me",
  "gmx.fr",
  "gmx.com",
  "aol.com",
]);

export const isFreeMailDomain = (domain) => FREE_MAIL_DOMAINS.has(normalizeDomain(domain));

const stripBrackets = (value) => String(value ?? "").replace(/[<>]/g, "").trim().toLowerCase();

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(toArray);
  return String(value).split(/[\s,]+/).filter(Boolean);
}

/**
 * Construit l'index des messages sortants (journal + file d'attente).
 * `domain` reste le domaine du site, même quand l'adresse est une boîte Gmail.
 */
export function buildOutgoingIndex({ queue, journal, registry }) {
  const byId = new Map();
  const byEmail = new Map();
  const byDomain = new Map();
  const rows = registry.rows ?? [];

  const siteDomainForEmail = (email) => {
    const e = String(email ?? "").toLowerCase();
    if (!e) return "";
    const row = rows.find((r) => String(r.contact ?? "").toLowerCase().split(/[\s,;]+/).includes(e));
    return row ? normalizeDomain(row.domaine) : "";
  };

  const siteDomainForId = (id) => {
    const row = rows.find((r) => r.domaine && (r.domaine === id || normalizeDomain(r.domaine) === id));
    return row ? normalizeDomain(row.domaine) : "";
  };

  const add = (entry) => {
    const domain = entry.domain || siteDomainForEmail(entry.to) || siteDomainForId(entry.id);
    if (!domain || isFreeMailDomain(domain)) return;
    const record = {
      id: entry.id,
      domain,
      to: String(entry.to ?? "").toLowerCase(),
      subject: entry.subject ?? "",
      subjectKey: normalizeSubject(entry.subject),
      sentAt: entry.sentAt ?? entry.at ?? "",
      messageId: stripBrackets(entry.messageId),
    };
    if (record.messageId) byId.set(record.messageId, record);
    if (record.to) byEmail.set(record.to, record);
    if (!byDomain.has(domain)) byDomain.set(domain, []);
    byDomain.get(domain).push(record);
  };

  for (const message of queue.messages ?? []) {
    if (message.status === "envoye" || message.status === "approuve") add(message);
  }
  for (const entry of journal) {
    if (!entry.ok) continue;
    add({
      id: entry.id,
      to: entry.to,
      subject: entry.subject,
      sentAt: entry.at,
      messageId: entry.messageId,
    });
  }
  return { byId, byEmail, byDomain };
}

/**
 * Rapproche un message reçu d'un envoi de la campagne.
 * Renvoie null si aucun indice ne permet de le rattacher.
 */
export function matchReply(email, index) {
  const refs = [...toArray(email.inReplyTo), ...toArray(email.references)].map(stripBrackets);
  for (const ref of refs) {
    if (index.byId.has(ref)) {
      return {
        outgoing: index.byId.get(ref),
        confidence: "certaine",
        reason: email.inReplyTo && stripBrackets(email.inReplyTo) === ref ? "In-Reply-To" : "References",
      };
    }
  }

  const from = String(email.from?.address ?? "").toLowerCase();
  const fromDomain = from.split("@")[1] ?? "";
  const subjectKey = normalizeSubject(email.subject);

  const byEmail = index.byEmail.get(from);
  if (byEmail && (!subjectKey || byEmail.subjectKey === subjectKey || subjectKey.includes(byEmail.subjectKey) || byEmail.subjectKey.includes(subjectKey))) {
    return { outgoing: byEmail, confidence: "probable", reason: "adresse expéditrice + objet" };
  }

  const candidates = isFreeMailDomain(fromDomain) ? [] : (index.byDomain.get(normalizeDomain(fromDomain)) ?? []);
  const sameSubject = candidates.find(
    (c) => subjectKey && c.subjectKey && (c.subjectKey === subjectKey || subjectKey.includes(c.subjectKey) || c.subjectKey.includes(subjectKey)),
  );
  if (sameSubject) {
    return { outgoing: sameSubject, confidence: "probable", reason: "domaine expéditeur + objet" };
  }

  if (byEmail) {
    return { outgoing: byEmail, confidence: "probable", reason: "adresse expéditrice connue" };
  }

  const anySubject = [...index.byId.values()].find(
    (c) => subjectKey && c.subjectKey && (c.subjectKey === subjectKey || subjectKey.includes(c.subjectKey)),
  );
  if (anySubject) {
    return { outgoing: anySubject, confidence: "a_verifier", reason: "objet similaire, expéditeur différent" };
  }
  return null;
}

/* -------------------------------------------------------- classification */

const has = (text, re) => re.test(String(text ?? ""));

export function isBounce(email) {
  const from = String(email.from?.address ?? "").toLowerCase();
  const subject = String(email.subject ?? "");
  const headers = email.headers ?? {};
  return (
    /^(mailer-daemon|postmaster)@/.test(from) ||
    has(subject, /\b(undeliver|delivery status|delivery failure|mail delivery|échec de la? livraison|non remis|message non distribu)/i) ||
    has(headers["content-type"], /multipart\/report/i) ||
    has(email.text, /\b(550[ -]?5\.1\.1|mailbox unavailable|user unknown|adresse (?:est )?introuvable)/i)
  );
}

export function isAutoReply(email) {
  const headers = email.headers ?? {};
  const auto = String(headers["auto-submitted"] ?? "").toLowerCase();
  const subject = String(email.subject ?? "");
  return (
    (auto && auto !== "no") ||
    Boolean(headers["x-autoreply"] || headers["x-autorespond"] || headers["x-auto-response-suppress"]) ||
    has(subject, /\b(absence|absent|out of office|automatic reply|réponse automatique|auto[- ]?reply|vacation)/i) ||
    has(email.text, /\b(je suis absent|absence jusqu|réponse automatique|ne suis pas au bureau)/i)
  );
}

/**
 * Classe un message. L'ordre des règles est volontaire : un « stop » prime sur
 * une formule de politesse, un refus prime sur un « merci ».
 */
export function classifyReply(email) {
  const text = `${email.subject ?? ""}\n${email.text ?? ""}`;
  if (isBounce(email)) return { category: "echec_livraison", label: "Échec de livraison", opposition: false, promised: false };
  if (isAutoReply(email)) return { category: "absence", label: "Message automatique d'absence", opposition: false, promised: false };
  if (has(text, /\b(stop|désinscri\w*|désabonn\w*|ne plus (?:me|nous) (?:contacter|solliciter)|retirez[- ]moi|unsubscribe|remove me)\b/i)) {
    return { category: "stop", label: "Demande de ne plus être contacté", opposition: true, promised: false };
  }
  if (has(text, /\b(payant|prestation payante|tarif|prix|devis|facture|sponsoris\w*|lien payant|à partir de \d+\s*€|\d+\s*€\s*(?:ht|ttc)?)\b/i)) {
    return { category: "payant", label: "Proposition payante", opposition: false, promised: false };
  }
  if (
    has(text, /article invité|article invite|contribution|tribune/i) &&
    has(text, /\b(accept\w*|bienvenu\w*|avec plaisir|volontiers|d'accord|ok pour|nous publierons|sera publié|programm\w*)/i)
  ) {
    return { category: "article_accepte", label: "Article invité accepté", opposition: false, promised: true };
  }
  if (has(text, /\b(publié|publiée|publierons|publiera|publierai|mettrons en ligne|mis en ligne|en ligne|publication prévue|sera publié|accepté|acceptée|validé|validée|retenu|retenue)\b/i)) {
    return { category: "publication_acceptee", label: "Publication acceptée, en attente", opposition: false, promised: true };
  }
  if (has(text, /\b(envoyez|transmettez|merci de nous (?:envoyer|faire parvenir)|le texte|votre texte|votre article|précisions|plan|word|docx|proposez)\b/i)) {
    return { category: "demande_texte", label: "Demande de texte ou de précisions", opposition: false, promised: false };
  }
  if (has(text, /\b(pas intéressé|pas interessé|ne correspond pas|refus|déclin\w*|sans suite|not interested|no thank you|ne donnerons pas suite|nous ne publierons pas)\b/i)) {
    return { category: "refus", label: "Refus explicite", opposition: false, promised: false };
  }
  if (has(text, /\b(avec plaisir|volontiers|intéressé|intéressée|merci pour (?:votre|ce) message|happy to|sounds good|oui)\b/i)) {
    return { category: "positive", label: "Réponse positive", opposition: false, promised: false };
  }
  return { category: "sans_decision", label: "Réponse sans décision", opposition: false, promised: false };
}

/**
 * Conséquences d'une réponse sur la ligne de registre : statut et prochaine
 * action. Une réponse positive ne devient jamais « backlink obtenu ».
 */
export function registryFieldsFor(category) {
  switch (category) {
    case "echec_livraison":
      return {
        statut: "Tentative non confirmée",
        prochaine_action: "Adresse invalide (échec de livraison) : vérifier une autre adresse publique avant toute relance",
      };
    case "absence":
      return { prochaine_action: "Réponse automatique d'absence : relancer après la date de retour indiquée" };
    case "stop":
      return { statut: "Opposition enregistrée", prochaine_action: "Ne plus contacter, même par un autre canal" };
    case "refus":
      return { statut: "Refusé", prochaine_action: "Aucune relance" };
    case "payant":
      return { statut: "Proposition payante refusée", prochaine_action: "Aucune suite : aucun lien payant" };
    case "article_accepte":
    case "publication_acceptee":
      return {
        statut: "Publication promise, non vérifiée",
        prochaine_action: "Contrôler la page annoncée avec netlinking-check-backlinks.mjs, puis le lien HTML",
      };
    case "demande_texte":
      return { statut: "Réponse reçue — texte demandé", prochaine_action: "Envoyer le texte demandé, sans engagement de lien" };
    case "positive":
      return { statut: "Réponse reçue — à qualifier", prochaine_action: "Répondre manuellement pour préciser la proposition" };
    case "correspondance_incertaine":
      return { prochaine_action: "Vérifier manuellement si ce message concerne la campagne (aucun message sortant identifié)" };
    default:
      return { statut: "Réponse reçue — sans décision", prochaine_action: "Relance unique possible après 10 à 14 jours" };
  }
}

/* ----------------------------------------------------------------- URL */

const SHORTENERS = new Set(["bit.ly", "t.co", "tinyurl.com", "goo.gl", "ow.ly", "lnkd.in", "buff.ly", "rebrand.ly", "cutt.ly"]);
const CONTACT_PATH = /\/(contact|contacts|mentions[-_]legales|a[-_]propos|about|legal|cgv|cgu|politique[-_]de[-_]confidentialite)(\/|$)/i;

/** Extrait les URL d'un texte, sans les ouvrir. */
export function extractUrls(text, { campaignDomain = "", confidence = "a_verifier" } = {}) {
  const found = [];
  const seen = new Set();
  const source = String(text ?? "");
  for (const m of source.matchAll(/https?:\/\/[^\s<>"'()\]]+/gi)) {
    let raw = m[0].replace(/[.,;:!?]+$/, "");
    let url;
    try {
      url = new URL(raw);
    } catch {
      continue;
    }
    if (!/^https?:$/.test(url.protocol)) continue;
    // Les paramètres de campagne ne changent pas la page : les retirer évite de
    // créer deux entrées pour la même publication.
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid$|gclid$|mc_cid$|mc_eid$)/i.test(key)) url.searchParams.delete(key);
    }
    const normalized = normalizeUrl(url.toString());
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    const host = normalizeDomain(url.hostname);
    let kind = "sans_rapport";
    if (host === "parrainio.fr") kind = "lien_parrainio";
    else if (SHORTENERS.has(host) || host.startsWith("xn--") || /^\d+\.\d+\.\d+\.\d+$/.test(host)) kind = "suspecte";
    else if (campaignDomain && host === normalizeDomain(campaignDomain)) {
      if (url.pathname === "/" || url.pathname === "") kind = "institutionnelle";
      else if (CONTACT_PATH.test(url.pathname)) kind = "contact";
      else kind = "publication";
    }
    const start = Math.max(0, (m.index ?? 0) - 120);
    found.push({
      url: url.toString(),
      normalizedUrl: normalized,
      host,
      kind,
      confidence: kind === "publication" ? confidence : confidence === "certaine" ? "certaine" : "a_verifier",
      context: source.slice(start, (m.index ?? 0) + raw.length + 120).replace(/\s+/g, " ").trim().slice(0, 300),
    });
  }
  return found;
}

/* ------------------------------------------------------------- contexte */

export function loadContext(paths) {
  const queue = JSON.parse(fs.readFileSync(paths.queue, "utf8"));
  const journal = readJsonl(paths.journal);
  const registry = readCsvRows(paths.registry);
  const oppositions = readCsvRows(paths.oppositions);
  return { queue, journal, registry, oppositions, outgoing: buildOutgoingIndex({ queue, journal, registry }) };
}

/* --------------------------------------------------------- orchestration */

function parseSource(source) {
  return simpleParser(source, { skipHtmlToText: false, skipTextToHtml: true });
}

function headerValue(headers, name) {
  if (!headers) return "";
  // `mailparser` expose les en-têtes sous forme de Map ; les tests utilisent
  // parfois un objet simple. Les deux formes sont acceptées.
  const value = typeof headers.get === "function" ? headers.get(name) : headers[name];
  if (!value) return "";
  return Array.isArray(value) ? value.join(" ") : String(value);
}

/** Transforme un message parsé en enregistrement minimal. */
export function toEmailRecord(parsed, uid) {
  const from = parsed.from?.value?.[0] ?? {};
  return {
    uid,
    messageId: stripBrackets(parsed.messageId),
    inReplyTo: stripBrackets(Array.isArray(parsed.inReplyTo) ? parsed.inReplyTo[0] : parsed.inReplyTo ?? headerValue(parsed.headers, "in-reply-to")),
    references: Array.isArray(parsed.references) ? parsed.references.join(" ") : headerValue(parsed.headers, "references") || parsed.references || "",
    headers: {
      "auto-submitted": headerValue(parsed.headers, "auto-submitted"),
      "x-autoreply": headerValue(parsed.headers, "x-autoreply"),
      "x-autorespond": headerValue(parsed.headers, "x-autorespond"),
      "content-type": headerValue(parsed.headers, "content-type"),
      "x-failed-recipients": headerValue(parsed.headers, "x-failed-recipients"),
      "final-recipient": headerValue(parsed.headers, "final-recipient"),
      "original-recipient": headerValue(parsed.headers, "original-recipient"),
    },
    from: { name: from.name ?? "", address: String(from.address ?? "").toLowerCase() },
    subject: parsed.subject ?? "",
    date: parsed.date ? new Date(parsed.date).toISOString() : "",
    text: parsed.text ?? "",
  };
}

/**
 * Relève les réponses et met à jour les fichiers de suivi.
 * `imapFactory` est injectable pour les tests ; aucun accès réseau en test.
 */
export async function syncReplies(options = {}) {
  const paths = { ...DEFAULT_PATHS, ...(options.paths ?? {}) };
  const dryRun = Boolean(options.dryRun);
  const limit = Number.isInteger(options.limit) && options.limit > 0 ? options.limit : 50;
  const now = options.now ?? (() => new Date().toISOString());
  const context = loadContext(paths);
  const previous = readJsonl(paths.replies);
  const seenIds = new Set(previous.map((r) => r.messageId).filter(Boolean));
  const previousPages = readJsonl(paths.pages);
  const pageKeys = new Set(previousPages.map((p) => `${normalizeDomain(p.domain)}|${normalizeUrl(p.url)}`));
  const knownOppositions = new Set(context.oppositions.rows.map((r) => normalizeDomain(r.domaine)));

  const state = fs.existsSync(paths.state) ? JSON.parse(fs.readFileSync(paths.state, "utf8")) : {};
  const backfill = Boolean(options.backfill);
  const registryDomains = new Set(
    (context.registry.rows ?? [])
      .map((r) => normalizeDomain(r.domaine))
      .filter((d) => d && !isFreeMailDomain(d)),
  );
  const factory =
    options.imapFactory ??
    ((config) =>
      new ImapFlow({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: { user: config.user, pass: config.password },
        logger: false,
        emitLogs: false,
      }));

  const config = options.imapConfig ?? loadImapConfig(process.env);
  if (config.missing?.length) {
    return { ok: false, error: `configuration IMAP incomplète : ${config.missing.join(", ")}`, examined: 0 };
  }

  const client = factory(config);
  const summary = {
    ok: true,
    examined: 0,
    matched: 0,
    byConfidence: { certaine: 0, probable: 0, a_verifier: 0 },
    categories: {},
    urls: 0,
    pagesAdded: 0,
    oppositionsAdded: 0,
    registryUpdated: 0,
    uncertain: 0,
    skipped: 0,
    backfill,
    backfillRemaining: null,
    errors: [],
    dryRun,
    lastUid: state.lastUid ?? 0,
  };

  let lock;
  try {
    await client.connect();
    lock = await client.getMailboxLock("INBOX", { readOnly: true });
    const mailbox = client.mailbox ?? {};
    if (!mailbox.exists) {
      summary.ok = true;
      summary.examined = 0;
      return summary;
    }

    const since = options.since
      ? new Date(options.since)
      : new Date(backfill || !state.lastUid ? CAMPAIGN_START : Date.now() - 30 * 86400000);
    const found = (await client.search({ since }, { uid: true })) ?? [];
    summary.available = found.length;
    let uids;
    if (backfill) {
      // Le curseur de rattrapage est une borne haute exclusive : on descend
      // vers les UID plus anciens sans jamais toucher au curseur principal.
      const upper = Number(
        state.backfill?.cursorUid ??
          state.backfill?.fromUid ??
          (Number.isInteger(options.fromUid) ? options.fromUid : null) ??
          state.lastUid ??
          Number.MAX_SAFE_INTEGER,
      );
      uids = found.filter((uid) => uid < upper).sort((a, b) => b - a).slice(0, limit);
      summary.backfillUpper = upper;
      summary.backfillRemaining = found.filter((uid) => uid < upper).length - uids.length;
    } else {
      uids = found.filter((uid) => uid > Number(state.lastUid ?? 0)).sort((a, b) => a - b);
      if (!state.lastUid) uids = uids.slice(-limit);
      else uids = uids.slice(0, limit);
    }

    const replies = [];
    const pages = [];
    const oppositions = [];
    const registryUpdates = new Map();
    let maxUid = Number(state.lastUid ?? 0);
    let minUid = Number.POSITIVE_INFINITY;

    for (const uid of uids) {
      summary.examined += 1;
      maxUid = Math.max(maxUid, uid);
      minUid = Math.min(minUid, uid);
      let parsed;
      try {
        const message = await client.fetchOne(uid, { envelope: true, source: true }, { uid: true });
        if (!message?.source) {
          summary.skipped += 1;
          continue;
        }
        parsed = await parseSource(message.source);
      } catch (error) {
        summary.errors.push(`UID ${uid} : ${error?.message ?? error}`);
        summary.skipped += 1;
        continue;
      }

      const email = toEmailRecord(parsed, uid);
      if (!email.messageId || seenIds.has(email.messageId)) {
        summary.skipped += 1;
        continue;
      }

      // Adresses réellement rejetées : en-têtes du rapport de remise ou corps.
      const failedRecipients = isBounce(email)
        ? [
            ...new Set(
              `${email.headers["x-failed-recipients"] ?? ""} ${email.headers["final-recipient"] ?? ""} ${email.headers["original-recipient"] ?? ""} ${email.text ?? ""}`
                .toLowerCase()
                .match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) ?? [],
            ),
          ]
            .filter(
              (address) =>
                !/^(mailer-daemon|postmaster|no-?reply|ne-?pas-?repondre)@/.test(address) &&
                !address.endsWith("@parrainio.fr"),
            )
            .slice(0, 5)
        : [];

      let match = matchReply(email, context.outgoing);
      if (!match && failedRecipients.length) {
        // Un échec de livraison ne répond pas au message : on le rattache par
        // l'adresse du destinataire original rejetée.
        const outgoing = failedRecipients
          .map((address) => context.outgoing.byEmail.get(address))
          .find(Boolean);
        if (outgoing) match = { outgoing, confidence: "certaine", reason: "échec de livraison" };
      }
      if (!match) {
        // Aucun message sortant identifié. Si l'expéditeur appartient à un
        // domaine déjà présent au registre, on conserve le message comme
        // « correspondance incertaine » : il ne modifie ni le statut ni la
        // prochaine action du domaine, et ne vaut jamais backlink.
        const fromDomain = normalizeDomain(String(email.from.address ?? "").split("@")[1] ?? "");
        if (fromDomain && !isFreeMailDomain(fromDomain) && registryDomains.has(fromDomain) && !isBounce(email) && !isAutoReply(email)) {
          match = {
            outgoing: {
              id: "",
              domain: fromDomain,
              to: email.from.address,
              subject: email.subject ?? "",
              subjectKey: normalizeSubject(email.subject),
              sentAt: "",
              messageId: "",
            },
            confidence: "a_verifier",
            reason: "domaine du registre, sans message sortant identifié",
          };
          summary.uncertain += 1;
        } else {
          summary.skipped += 1;
          continue;
        }
      }

      summary.matched += 1;
      summary.byConfidence[match.confidence] = (summary.byConfidence[match.confidence] ?? 0) + 1;
      const uncertainMatch = match.reason === "domaine du registre, sans message sortant identifié";
      const classification = uncertainMatch
        ? { category: "correspondance_incertaine", label: "Correspondance incertaine", opposition: false, promised: false }
        : classifyReply(email);
      summary.categories[classification.category] = (summary.categories[classification.category] ?? 0) + 1;

      const urls = extractUrls(email.text, {
        campaignDomain: match.outgoing.domain,
        confidence: match.confidence === "certaine" ? "certaine" : "probable",
      });
      summary.urls += urls.filter((u) => u.kind === "publication").length;

      const record = {
        messageId: email.messageId,
        uid,
        receivedAt: email.date || now(),
        from: email.from.address,
        fromName: email.from.name,
        domain: match.outgoing.domain,
        outgoingId: match.outgoing.id,
        confidence: match.confidence,
        reason: match.reason,
        category: classification.category,
        categoryLabel: classification.label,
        promised: classification.promised,
        opposition: classification.opposition,
        ...(failedRecipients.length ? { failedRecipients } : {}),
        snippet: String(email.text ?? "").replace(/\s+/g, " ").trim().slice(0, 240),
        urls: urls.map((u) => ({ url: u.url, kind: u.kind, confidence: u.confidence })),
      };
      replies.push(record);
      seenIds.add(email.messageId);

      for (const url of urls) {
        if (url.kind !== "publication") continue;
        const key = `${match.outgoing.domain}|${url.normalizedUrl}`;
        if (pageKeys.has(key)) continue;
        pageKeys.add(key);
        pages.push({
          domain: match.outgoing.domain,
          url: url.normalizedUrl,
          source: "email",
          messageId: email.messageId,
          receivedAt: record.receivedAt,
          confidence: url.confidence,
          category: classification.category,
          note: url.context.slice(0, 200),
          status: "a_verifier",
          addedAt: now(),
        });
        summary.pagesAdded += 1;
      }

      if (classification.opposition && !knownOppositions.has(match.outgoing.domain)) {
        knownOppositions.add(match.outgoing.domain);
        oppositions.push({
          domaine: match.outgoing.domain,
          nom: match.outgoing.id,
          date: (email.date || now()).slice(0, 10),
          canal: "email",
          motif: "Demande explicite de ne plus être contacté (réponse à la campagne) — ne plus solliciter",
        });
        summary.oppositionsAdded += 1;
      }

      if (!uncertainMatch) {
        const current = registryUpdates.get(match.outgoing.domain) ?? {};
        registryUpdates.set(match.outgoing.domain, {
          ...current,
          ...registryFieldsFor(classification.category),
          reponse: `${classification.label} (${(email.date || now()).slice(0, 10)}, ${match.confidence})`,
          derniere_verif: (email.date || now()).slice(0, 10),
        });
      }
    }

    if (!dryRun) {
      appendJsonl(paths.replies, replies);
      appendJsonl(paths.pages, pages);
      if (oppositions.length) {
        const { header, rows } = readCsvRows(paths.oppositions);
        const merged = [...rows, ...oppositions];
        const cols = header.length ? header : ["domaine", "nom", "date", "canal", "motif"];
        writeCsv(paths.oppositions, cols, merged);
      }
      if (registryUpdates.size) {
        const { header, rows } = readCsvRows(paths.registry);
        for (const [domain, update] of registryUpdates) {
          const row = rows.find((r) => normalizeDomain(r.domaine) === domain);
          if (!row) continue;
          Object.assign(row, update);
          summary.registryUpdated += 1;
        }
        writeCsv(paths.registry, header, rows);
      }
      const nextState = {
        lastUid: backfill ? Number(state.lastUid ?? Math.max(0, ...found)) : maxUid,
        lastRun: now(),
        mailbox: "INBOX",
        totalMessages: mailbox.exists,
        examined: summary.examined,
      };
      if (state.firstSyncUid !== undefined) nextState.firstSyncUid = state.firstSyncUid;
      if (backfill) {
        const fromUid = Number(
          state.backfill?.fromUid ??
            (Number.isInteger(options.fromUid) ? options.fromUid : null) ??
            state.lastUid ??
            Math.max(0, ...found),
        );
        const cursorUid = Number.isFinite(minUid) ? minUid : Number(state.backfill?.cursorUid ?? fromUid);
        nextState.backfill = {
          fromUid,
          cursorUid,
          examinedTotal: Number(state.backfill?.examinedTotal ?? 0) + summary.examined,
          remaining: found.filter((uid) => uid < cursorUid).length,
          lastRun: now(),
        };
        summary.backfillRemaining = nextState.backfill.remaining;
        summary.backfillCursor = cursorUid;
      } else if (state.backfill) {
        nextState.backfill = state.backfill;
      }
      fs.mkdirSync(path.dirname(paths.state), { recursive: true });
      fs.writeFileSync(paths.state, `${JSON.stringify(nextState, null, 2)}\n`);
      summary.lastUid = nextState.lastUid;
    }
  } catch (error) {
    summary.ok = false;
    summary.error = `${error?.code ?? ""} ${error?.responseText ?? error?.message ?? error}`.trim();
  } finally {
    if (lock) {
      try {
        lock.release();
      } catch {
        /* ignore */
      }
    }
    try {
      await client.logout();
    } catch {
      /* ignore */
    }
  }
  return summary;
}

/** Contrôle en lecture seule : dossiers + un échantillon d'en-têtes. */
export async function checkImap(options = {}) {
  const config = options.imapConfig ?? loadImapConfig(process.env);
  if (config.missing?.length) return { ok: false, error: `configuration incomplète : ${config.missing.join(", ")}` };
  const factory =
    options.imapFactory ??
    ((cfg) =>
      new ImapFlow({
        host: cfg.host,
        port: cfg.port,
        secure: cfg.secure,
        auth: { user: cfg.user, pass: cfg.password },
        logger: false,
        emitLogs: false,
      }));
  const client = factory(config);
  const limit = options.limit ?? 5;
  let lock;
  const result = { ok: true, host: config.host, port: config.port, user: maskEmail(config.user), folders: 0, exists: 0, sample: [] };
  try {
    await client.connect();
    const mailboxes = await client.list();
    result.folders = mailboxes.length;
    lock = await client.getMailboxLock("INBOX", { readOnly: true });
    result.exists = client.mailbox?.exists ?? 0;
    const uids = (await client.search({ since: new Date(options.since ?? CAMPAIGN_START) }, { uid: true })) ?? [];
    result.matching = uids.length;
    result.minUid = uids.length ? Math.min(...uids) : null;
    result.maxUid = uids.length ? Math.max(...uids) : null;
    for (const uid of uids.slice(-limit)) {
      const message = await client.fetchOne(uid, { envelope: true }, { uid: true });
      if (!message) continue;
      result.sample.push({
        uid,
        date: message.envelope?.date ? new Date(message.envelope.date).toISOString() : "",
        subject: String(message.envelope?.subject ?? "").slice(0, 60),
      });
    }
  } catch (error) {
    result.ok = false;
    result.error = `${error?.code ?? ""} ${error?.responseText ?? error?.message ?? error}`.trim();
  } finally {
    if (lock) {
      try {
        lock.release();
      } catch {
        /* ignore */
      }
    }
    try {
      await client.logout();
    } catch {
      /* ignore */
    }
  }
  return result;
}

/* ---------------------------------------------------------------- rapport */

export function renderReport(summary) {
  const lines = [];
  lines.push(`# Relève des réponses — ${new Date().toISOString().slice(0, 10)}`);
  lines.push("");
  lines.push("| Indicateur | Valeur |");
  lines.push("|---|---|");
  lines.push(`| Messages examinés | ${summary.examined} |`);
  lines.push(`| Réponses rattachées à la campagne | ${summary.matched} |`);
  lines.push(`| Correspondances certaines | ${summary.byConfidence?.certaine ?? 0} |`);
  lines.push(`| Correspondances probables | ${summary.byConfidence?.probable ?? 0} |`);
  lines.push(`| Correspondances à vérifier | ${summary.byConfidence?.a_verifier ?? 0} |`);
  lines.push(`| URL de publication extraites | ${summary.pagesAdded ?? 0} |`);
  lines.push(`| Oppositions enregistrées | ${summary.oppositionsAdded ?? 0} |`);
  lines.push(`| Lignes de registre mises à jour | ${summary.registryUpdated ?? 0} |`);
  lines.push(`| Correspondances incertaines (domaine du registre) | ${summary.uncertain ?? 0} |`);
  lines.push(`| Messages ignorés | ${summary.skipped} |`);
  if (summary.backfill) {
    lines.push(`| Mode | rattrapage historique (curseur principal inchangé) |`);
    lines.push(`| Messages antérieurs restants | ${summary.backfillRemaining ?? 0} |`);
  }
  lines.push(`| Erreurs | ${summary.errors?.length ?? 0} |`);
  lines.push("");
  lines.push("Aucun backlink n'est compté ici : seules des pages à vérifier sont transmises au");
  lines.push("vérificateur. Un lien n'est acquis qu'après constat HTML sur la page publique.");
  lines.push("");
  return lines.join("\n");
}

/* -------------------------------------------------------------------- CLI */

function parseArgs(argv) {
  const args = { dryRun: false, check: false, sync: false, report: false, verify: false, backfill: false, limit: null, since: null, fromUid: null, quiet: false };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--check-imap") args.check = true;
    else if (a === "--sync") args.sync = true;
    else if (a === "--report") args.report = true;
    else if (a === "--verify") args.verify = true;
    else if (a === "--backfill") args.backfill = true;
    else if (a === "--limit") args.limit = Number(next());
    else if (a === "--since") args.since = next();
    else if (a === "--from-uid") args.fromUid = Number(next());
    else if (a === "--quiet") args.quiet = true;
    else if (a === "--help" || a === "-h") args.help = true;
  }
  return args;
}

function printSummary(summary, log = console.log) {
  log("=== Relève des réponses — rapport ===");
  log(`Messages examinés               : ${summary.examined}`);
  log(`Réponses rattachées             : ${summary.matched}`);
  log(`  certaines                     : ${summary.byConfidence?.certaine ?? 0}`);
  log(`  probables                     : ${summary.byConfidence?.probable ?? 0}`);
  log(`  à vérifier                    : ${summary.byConfidence?.a_verifier ?? 0}`);
  log(`URL de publication extraites    : ${summary.pagesAdded ?? 0}`);
  log(`Oppositions enregistrées        : ${summary.oppositionsAdded ?? 0}`);
  log(`Correspondances incertaines     : ${summary.uncertain ?? 0}`);
  log(`Registre mis à jour             : ${summary.registryUpdated ?? 0}`);
  log(`Messages ignorés                : ${summary.skipped}`);
  if (summary.backfill) log(`Mode                            : rattrapage (curseur principal inchangé)`);
  if (summary.backfillRemaining !== null && summary.backfillRemaining !== undefined) {
    log(`Messages antérieurs restants    : ${summary.backfillRemaining}`);
  }
  if (summary.errors?.length) log(`Erreurs                         : ${summary.errors.join(" ; ")}`);
  if (summary.dryRun) log("[dry-run] aucun fichier écrit.");
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(
      "node scripts/netlinking-sync-replies.mjs [--check-imap] [--dry-run] [--sync] [--backfill [--from-uid N]] [--limit N] [--since YYYY-MM-DD] [--report] [--verify]",
    );
    return;
  }
  if (!args.check && !args.sync && !args.report && !args.dryRun) {
    console.log("Rien à faire : ajoutez --check-imap, --dry-run, --sync ou --backfill.");
    return;
  }

  const env = loadLocalEnv(".env.local", process.env);
  const config = loadImapConfig(env);

  if (args.check) {
    const result = await checkImap({ imapConfig: config, limit: args.limit ?? 5, since: args.since });
    if (!result.ok) {
      console.log(`✗ IMAP : ${result.error}`);
      console.log("  Variables attendues : IMAP_HOST, IMAP_PORT, IMAP_USER, IMAP_PASSWORD (ou SMTP_USER/SMTP_PASSWORD).");
      return;
    }
    console.log(`✓ IMAP ${result.host}:${result.port} — ${result.user} (lecture seule)`);
    console.log(`Dossiers : ${result.folders} — messages dans INBOX : ${result.exists}`);
    console.log(
      `Messages depuis le début de campagne : ${result.matching ?? 0} (UID ${result.minUid ?? "-"} → ${result.maxUid ?? "-"})`,
    );
    console.log(`Échantillon : ${result.sample.length} en-tête(s)`);
    return;
  }

  const summary = await syncReplies({
    dryRun: args.dryRun,
    backfill: args.backfill,
    fromUid: args.fromUid,
    limit: args.limit ?? 50,
    since: args.since,
    imapConfig: config,
    log: args.quiet ? () => {} : console.log,
  });

  if (!summary.ok) {
    console.log(`✗ Relève impossible : ${summary.error}`);
    return;
  }
  if (!args.quiet) printSummary(summary);

  if (args.report) {
    const stamp = new Date().toISOString();
    // Heure incluse : deux relèves le même jour ne s'écrasent pas.
    const file = `docs/netlinking/donnees/reponses-rapport-${stamp.slice(0, 10)}-${stamp.slice(11, 16).replace(":", "")}Z.md`;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, renderReport(summary));
    console.log(`Rapport : ${file}`);
  }

  if (args.verify && !args.dryRun) {
    console.log("[verify] contrôle des pages de publication annoncées…");
    const run = spawnSync(process.execPath, ["scripts/netlinking-check-backlinks.mjs", "--publication-only"], {
      stdio: "inherit",
    });
    if (run.status !== 0) console.log("[verify] le vérificateur a signalé une erreur (voir ci-dessus).");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(`✗ ${error?.message ?? error}`);
    process.exitCode = 1;
  });
}
