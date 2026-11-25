#!/usr/bin/env node
/**
 * Envoi des e-mails de prospection éditoriale Parrainio.
 *
 * Sécurité :
 * - aucun secret n'est affiché ni journalisé ;
 * - par défaut le script ne fait qu'un essai à blanc (--dry-run) ;
 * - un envoi réel exige DEUX verrous : le message doit être `approuve` dans la
 *   file d'attente ET la commande doit inclure `--send --confirm` ;
 * - une seule personne destinataire par message, journal JSONL pour le suivi.
 *
 * Usage :
 *   node scripts/send-outreach.mjs --check
 *   node scripts/send-outreach.mjs --dry-run
 *   node scripts/send-outreach.mjs --send --confirm [--limit 1] [--id finance-heros]
 *   node scripts/send-outreach.mjs --status
 *
 * Note TLS : un antivirus qui inspecte les connexions sortantes (Avast, ESET,
 * Kaspersky…) remplace le certificat du serveur par le sien, que Node ne
 * connaît pas → la vérification échoue. On ne désactive jamais la
 * vérification : on utilise le magasin de certificats du système.
 *   node --use-system-ca scripts/send-outreach.mjs --check
 */
import { appendFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";

const ROOT = process.cwd();
const QUEUE_PATH = process.env.OUTREACH_QUEUE
  ? path.resolve(ROOT, process.env.OUTREACH_QUEUE)
  : path.join(ROOT, "docs/netlinking/campagne-email/file-attente.json");
const LOG_PATH = process.env.OUTREACH_LOG
  ? path.resolve(ROOT, process.env.OUTREACH_LOG)
  : path.join(ROOT, "docs/netlinking/campagne-email/journal-envois.jsonl");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
const TLS_TRUST_ERRORS = new Set([
  "SELF_SIGNED_CERT_IN_CHAIN",
  "DEPTH_ZERO_SELF_SIGNED_CERT",
  "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
  "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
  "CERT_SIGNATURE_FAILURE",
  "ERR_TLS_CERT_ALTNAME_INVALID",
]);

/** Dernière configuration lue, pour masquer le mot de passe même dans le catch global. */
let activeConfig = null;

/**
 * Masque le mot de passe (et ses encodages AUTH) dans tout texte destiné à
 * l'écran ou au journal. Nodemailer peut inclure la commande AUTH dans
 * `error.message` : on retire aussi ses formes base64.
 */
function redact(text, config = activeConfig) {
  let out = String(text ?? "");
  if (!config?.password) return out;
  const variants = new Set([
    config.password,
    Buffer.from(config.password, "utf8").toString("base64"),
    encodeURIComponent(config.password),
  ]);
  if (config.user) {
    variants.add(Buffer.from(`\0${config.user}\0${config.password}`, "utf8").toString("base64"));
    variants.add(Buffer.from(`\0${config.user}\0${config.password}`, "utf8").toString("base64url"));
  }
  for (const variant of variants) {
    if (variant) out = out.split(variant).join("[masqué]");
  }
  return out;
}

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const valueOf = (flag, fallback) => {
  const index = args.indexOf(flag);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

function loadLocalEnv() {
  try {
    process.loadEnvFile(path.join(ROOT, ".env.local"));
  } catch {
    // Pas de .env.local : les variables doivent venir de l'environnement.
  }
}

function readSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD;
  activeConfig = { host, port, user, password };
  const missing = [
    !host && "SMTP_HOST",
    !(Number.isInteger(port) && port > 0 && port < 65536) && "SMTP_PORT",
    !user && "SMTP_USER",
    !password && "SMTP_PASSWORD",
  ].filter(Boolean);
  return { host, port, user, password, missing };
}

function makeTransport(config) {
  const implicitTls = config.port === 465;
  const local = LOOPBACK_HOSTS.has(String(config.host).toLowerCase());
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: implicitTls,
    // Certificat toujours vérifié. Sur 587 (STARTTLS) on exige le chiffrement
    // pour qu'un mot de passe ne parte jamais en clair — sauf serveur de test local.
    requireTLS: !implicitTls && !local,
    tls: { minVersion: "TLSv1.2" },
    auth: { user: config.user, pass: config.password },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    // Jamais de transcription SMTP : elle contient les échanges AUTH.
    logger: false,
    debug: false,
  });
}

/** Pistes de résolution, sans jamais affaiblir la vérification TLS. */
function explainSmtpError(error, config) {
  const code = String(error?.code ?? "");
  const response = String(error?.response ?? "");
  // Nodemailer encapsule les erreurs TLS dans `ESOCKET` : on regarde aussi le texte.
  const text = `${response} ${error?.message ?? ""}`;
  const tlsTrust = TLS_TRUST_ERRORS.has(code) || /self[- ]signed|certificate in certificate chain|unable to verify|certificate has expired|altname/i.test(text);
  if (tlsTrust) {
    return [
      "  → Certificat TLS non vérifié : un antivirus/proxy inspecte probablement les connexions sortantes",
      "    (Avast Web/Mail Shield, ESET, Kaspersky) et signe le certificat avec sa propre autorité.",
      "  → Relancez avec le magasin de certificats du système, sans désactiver la vérification :",
      "      node --use-system-ca scripts/send-outreach.mjs --check",
      "    (ou désactivez l'inspection SSL de l'antivirus pour les ports 465/587).",
    ].map((line) => redact(line, config));
  }
  if (code === "EAUTH" || /authentif|\b535\b|\b534\b/i.test(response)) {
    return [
      "  → Authentification refusée : vérifiez SMTP_USER (adresse complète parrainage@parrainio.fr)",
      "    et SMTP_PASSWORD (mot de passe de la boîte ; réinitialisable dans l'espace client OVH).",
      "    Côté OVH, l'identifiant est l'adresse e-mail entière, pas un login court.",
    ].map((line) => redact(line, config));
  }
  if (["ETIMEDOUT", "ECONNECTION", "ESOCKET", "ECONNREFUSED", "EHOSTUNREACH"].includes(code)) {
    return [
      "  → Connexion impossible : vérifiez SMTP_HOST/SMTP_PORT (465 = TLS implicite, 587 = STARTTLS)",
      "    et qu'aucun pare-feu ne bloque la sortie SMTP.",
    ].map((line) => redact(line, config));
  }
  if (["ENOTFOUND", "EDNS"].includes(code)) {
    return ["  → Nom d'hôte introuvable : SMTP_HOST doit être ssl0.ovh.net ou smtp.mail.ovh.net."].map((line) =>
      redact(line, config),
    );
  }
  return [];
}

async function loadQueue() {
  const raw = await readFile(QUEUE_PATH, "utf8");
  const queue = JSON.parse(raw);
  if (!Array.isArray(queue.messages)) throw new Error("file-attente.json : tableau `messages` manquant");
  return queue;
}

function validate(queue, message) {
  const problems = [];
  if (!EMAIL_RE.test(message.to ?? "")) problems.push("adresse destinataire invalide");
  if (!message.subject?.trim()) problems.push("objet manquant");
  if (!message.body?.trim()) problems.push("corps manquant");
  if (!/https:\/\/parrainio\.fr/.test(message.body ?? "")) problems.push("lien parrainio.fr absent");
  if ((message.body?.length ?? 0) > 4000) problems.push("corps trop long (> 4000 caractères)");
  if (queue.sender?.email && !EMAIL_RE.test(queue.sender.email)) problems.push("expéditeur invalide");
  return problems;
}

async function readLog() {
  try {
    const raw = await readFile(LOG_PATH, "utf8");
    return raw
      .split(/\r?\n/)
      .filter(Boolean)
      .flatMap((line) => {
        try {
          return [JSON.parse(line)];
        } catch {
          return [];
        }
      });
  } catch {
    return [];
  }
}

async function alreadyContacted() {
  const rows = await readLog();
  return new Set(rows.filter((row) => row.ok).map((row) => String(row.to).toLowerCase()));
}

function maskEmail(email) {
  const [local, domain] = String(email).split("@");
  if (!domain) return "***";
  return `${local.slice(0, 2)}***@${domain}`;
}

function describe(config) {
  console.log(`SMTP : ${config.host}:${config.port} — compte ${maskEmail(config.user)}`);
}

async function check() {
  loadLocalEnv();
  const config = readSmtpConfig();
  activeConfig = config;
  if (config.missing.length) {
    console.log(`✗ Configuration SMTP incomplète : ${config.missing.join(", ")} absent(s).`);
    console.log("  Aucun e-mail ne peut être envoyé. Voir docs/netlinking/campagne-email/README.md.");
    process.exitCode = 2;
    return;
  }
  describe(config);
  try {
    const queue = await loadQueue();
    if (queue.sender?.email && config.user.toLowerCase() !== String(queue.sender.email).toLowerCase()) {
      console.log(`⚠ SMTP_USER (${maskEmail(config.user)}) ≠ expéditeur de la file (${queue.sender.email}).`);
      console.log("  Le serveur risque de réécrire l'expéditeur (SPF/DMARC). Corrigez avant tout envoi.");
    }
  } catch {
    // File absente ou illisible : le test SMTP reste valable seul.
  }
  console.log("Mode vérification : connexion + authentification uniquement, aucun e-mail envoyé.");
  const transport = makeTransport(config);
  try {
    await transport.verify();
    console.log("✓ Connexion SMTP et authentification réussies (aucun e-mail envoyé).");
  } catch (error) {
    const detail = redact(`${error?.code ?? ""} ${error?.response ?? error?.message ?? error}`, config).trim();
    console.log(`✗ Échec SMTP : ${detail}`);
    for (const line of explainSmtpError(error, config)) console.log(line);
    process.exitCode = 1;
  } finally {
    transport.close();
  }
}

async function dryRun() {
  const queue = await loadQueue();
  const idFilter = valueOf("--id", null);
  const messages = queue.messages.filter((m) => !idFilter || m.id === idFilter);
  const contacted = await alreadyContacted();
  console.log(`File : ${path.relative(ROOT, QUEUE_PATH)} — ${messages.length} message(s) sélectionné(s).`);
  console.log(`Expéditeur prévu : ${queue.sender?.name ?? "?"} <${queue.sender?.email ?? "?"}>`);
  let ready = 0;
  for (const message of messages) {
    const problems = validate(queue, message);
    const approved = message.status === "approuve";
    if (contacted.has(String(message.to).toLowerCase())) problems.push("adresse déjà contactée avec succès");
    if (approved && !problems.length) ready += 1;
    console.log(
      `\n- ${message.id} → ${message.to} [${message.status}]${problems.length ? " ⚠ " + problems.join(" ; ") : ""}`,
    );
    console.log(`  Objet : ${message.subject}`);
    console.log(`  ${message.body.split("\n")[0]}…`);
  }
  console.log(`\nApprouvés et valides : ${ready}/${messages.length}.`);
  console.log("Aucun e-mail envoyé (mode essai à blanc).");
}

async function send() {
  loadLocalEnv();
  if (!has("--confirm")) {
    console.log("✗ Envoi refusé : ajoutez --confirm après avoir relu la file d'attente.");
    process.exitCode = 2;
    return;
  }
  const config = readSmtpConfig();
  if (config.missing.length) {
    console.log(`✗ Configuration SMTP incomplète : ${config.missing.join(", ")} absent(s). Rien n'a été envoyé.`);
    process.exitCode = 2;
    return;
  }
  const queue = await loadQueue();
  const idFilter = valueOf("--id", null);
  const limit = Math.max(1, Math.min(20, Number(valueOf("--limit", "20")) || 20));
  const delay = Math.max(0, Number(valueOf("--delay", "20000")) || 0);

  const contacted = await alreadyContacted();
  const candidates = queue.messages
    .filter((m) => !idFilter || m.id === idFilter)
    .filter((m) => m.status === "approuve")
    .filter((m) => !contacted.has(String(m.to).toLowerCase()) || has("--force"))
    .slice(0, limit);
  if (!candidates.length) {
    console.log("✗ Aucun message au statut « approuve ». Rien n'a été envoyé.");
    process.exitCode = 2;
    return;
  }
  if (queue.sender?.email && config.user && config.user.toLowerCase() !== queue.sender.email.toLowerCase()) {
    console.log(
      `✗ Le compte SMTP (${maskEmail(config.user)}) ne correspond pas à l'expéditeur déclaré (${queue.sender.email}).`,
    );
    console.log("  Corrigez SMTP_USER ou l'expéditeur de la file. Rien n'a été envoyé.");
    process.exitCode = 2;
    return;
  }

  const transport = makeTransport(config);
  try {
    await transport.verify();
  } catch (error) {
    const detail = redact(`${error?.code ?? ""} ${error?.response ?? error?.message ?? error}`, config).trim();
    console.log(`✗ Connexion SMTP impossible : ${detail}. Rien n'a été envoyé.`);
    for (const line of explainSmtpError(error, config)) console.log(line);
    transport.close();
    process.exitCode = 1;
    return;
  }

  let sent = 0;
  const sentMessages = [];
  for (const [index, message] of candidates.entries()) {
    const problems = validate(queue, message);
    if (problems.length) {
      console.log(`- ${message.id} ignoré : ${problems.join(" ; ")}`);
      continue;
    }
    const startedAt = new Date().toISOString();
    try {
      const info = await transport.sendMail({
        from: { name: queue.sender.name, address: queue.sender.email },
        to: message.to,
        replyTo: queue.sender.replyTo ?? queue.sender.email,
        subject: message.subject,
        text: message.body,
      });
      const accepted = (info.accepted ?? []).map(String);
      const rejected = (info.rejected ?? []).map(String);
      await appendFile(
        LOG_PATH,
        JSON.stringify({
          at: startedAt,
          id: message.id,
          site: message.site,
          to: message.to,
          subject: message.subject,
          messageId: info.messageId,
          response: redact(info.response, config),
          accepted,
          rejected,
          ok: accepted.length > 0 && rejected.length === 0,
        }) + "\n",
        "utf8",
      );
      const ok = accepted.length > 0 && rejected.length === 0;
      if (ok) {
        sent += 1;
        message.status = "envoye";
        message.sentAt = startedAt;
        message.messageId = info.messageId;
        message.smtpResponse = redact(info.response, config);
        sentMessages.push(message);
      }
      console.log(`${ok ? "✓" : "✗"} ${message.id} → ${message.to} : ${ok ? "accepté" : "refusé"} (${info.response})`);
    } catch (error) {
      const detail = redact(`${error?.response ?? error?.message ?? String(error)}`, config);
      await appendFile(
        LOG_PATH,
        JSON.stringify({
          at: startedAt,
          id: message.id,
          site: message.site,
          to: message.to,
          subject: message.subject,
          ok: false,
          errorCode: error?.code ?? null,
          error: detail,
        }) + "\n",
        "utf8",
      );
      console.log(`✗ ${message.id} → ${message.to} : ${error?.code ?? ""} ${detail}`);
    }
    if (index < candidates.length - 1 && delay) await new Promise((r) => setTimeout(r, delay));
  }
  transport.close();
  if (sentMessages.length) {
    /* La file doit refléter l'envoi réel : sans cela, un message reste « approuve ». */
    await writeFile(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`, "utf8");
  }
  console.log(`\n${sent}/${candidates.length} e-mail(s) accepté(s) par le serveur. Journal : ${path.relative(ROOT, LOG_PATH)}`);
  if (sent < candidates.length) process.exitCode = 1;
}

async function status() {
  const rows = await readLog();
  if (!rows.length) {
    console.log("Aucun envoi journalisé pour l'instant.");
    return;
  }
  const ok = rows.filter((r) => r.ok).length;
  const failed = rows.filter((r) => !r.ok).length;
  console.log(`Journal : ${rows.length} envoi(s) — ${ok} accepté(s), ${failed} en échec.`);
  for (const row of rows.slice(-20)) {
    console.log(`${row.at ?? "?"}  ${row.ok ? "OK " : "ERR"}  ${row.to}  ${row.subject ?? ""}`);
  }
}

const mode = has("--check")
  ? check
  : has("--send")
    ? send
    : has("--status")
      ? status
      : dryRun;

mode().catch((error) => {
  console.error(`Erreur : ${redact(error?.message ?? error)}`);
  process.exitCode = 1;
});
