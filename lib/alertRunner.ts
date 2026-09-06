import { getManagedOffer, getManagedOffers, type ManagedOffer } from "@/data/managedOffers";
import { loadSignature, saveSignature, type OfferSignatureRecord } from "./offerSignature";
import { listActiveSubscribers } from "./alertSubscriptions";
import { hashEmail, signAlertToken } from "./alertTokens";
import { getAlertsConfig } from "./alertsConfig";
import { SITE_URL } from "./siteUrl";

/**
 * Détection de changements réels + envoi des e-mails d'alerte.
 *
 * Principe (chantier) :
 * - la source de vérité est l'existante : getManagedOffers() (seed +
 *   offer-overrides.json). Aucune copie des données d'offre n'est créée ;
 * - seuls les champs SIGNIFICATIFS sont comparés (primes, reverse,
 *   conditions, code/lien de parrainage). CSS, layout, SEO et le badge
 *   mensuel « vérifiées en … » ne font PAS partie de la signature et ne
 *   déclenchent jamais d'alerte ;
 * - le premier passage après activation enregistre la signature de
 *   référence sans envoyer d'e-mail ;
 * - un changement = un e-mail consolidé par abonné (tous les champs
 *   modifiés dans un seul message), jamais un e-mail par champ ;
 * - seuls les abonnements `active` (double opt-in confirmé) sont notifiés ;
 * - l'e-mail n'invente rien : seuls les champs réellement modifiés
 *   apparaissent, avec leurs anciennes et nouvelles valeurs.
 *
 * Déclenchement : cette fonction doit être appelée explicitement après une
 * modification réelle des données d'offre (route admin /api/alerts/check,
 * appelable depuis la console ou un hook de déploiement). Aucun cron ni
 * rendu de page ne la déclenche.
 */

type SignificantFields = {
  partnerReward: string;
  parrainioReward: string;
  referralCode: string;
  referralLink: string;
  conditions: string;
};

const FIELD_LABELS: Record<keyof SignificantFields, string> = {
  partnerReward: "Prime filleul",
  parrainioReward: "Reverse Parrainio",
  referralCode: "Code de parrainage",
  referralLink: "Lien de parrainage",
  conditions: "Conditions d'éligibilité",
};

function significantFields(offer: ManagedOffer): SignificantFields {
  return {
    partnerReward: offer.partnerReward ?? "",
    parrainioReward: offer.parrainioReward ?? "",
    referralCode: offer.referralCode ?? "",
    referralLink: offer.referralLink ?? "",
    conditions: (offer.conditions ?? []).join("\n"),
  };
}

export function computeOfferSignature(offer: ManagedOffer): string {
  return JSON.stringify(significantFields(offer));
}

export type OfferFieldChange = { field: keyof SignificantFields; label: string; before: string; after: string };

export function diffOfferSignatures(before: string, after: string): OfferFieldChange[] {
  let previous: Partial<SignificantFields> = {};
  let current: Partial<SignificantFields> = {};
  try { previous = JSON.parse(before) as Partial<SignificantFields>; } catch { /* signature illisible → diff global */ }
  try { current = JSON.parse(after) as Partial<SignificantFields>; } catch { /* idem */ }
  const changes: OfferFieldChange[] = [];
  for (const field of Object.keys(FIELD_LABELS) as (keyof SignificantFields)[]) {
    const b = previous[field] ?? "";
    const a = current[field] ?? "";
    if (b !== a) changes.push({ field, label: FIELD_LABELS[field], before: b, after: a });
  }
  return changes;
}

export type OfferAlertOutcome = {
  slug: string;
  status:
    | "first-reference"      // première empreinte enregistrée, aucun e-mail
    | "no-change"
    | "changed-no-subscribers"
    | "notified"
    | "notify-failed"
    | "storage-unavailable";
  changedFields: string[];
  notifiedCount: number;
  failedCount: number;
};

function smtpEnv() {
  const { SMTP_HOST: host, SMTP_PORT: port, SMTP_USER: user, SMTP_PASSWORD: password } = process.env;
  if (!host || !port || !user || !password) return null;
  return { host, port: Number(port), user, password };
}

function buildAlertEmail(params: {
  offerName: string;
  changes: OfferFieldChange[];
  unsubscribeUrl: string;
  offerUrl: string;
}): { subject: string; text: string } {
  const lines: string[] = [
    "Bonjour,",
    "",
    `L'offre ${params.offerName} que vous surveillez vient d'évoluer.`,
    "",
  ];
  for (const change of params.changes) {
    lines.push(change.label + " — ancienne information :");
    lines.push(change.before || "(aucune)");
    lines.push(change.label + " — nouvelle information :");
    lines.push(change.after || "(aucune)");
    lines.push("");
  }
  lines.push(`Voir l'offre sur Parrainio → ${params.offerUrl}`);
  lines.push("");
  lines.push("Vous recevez cet email car vous avez demandé une alerte pour cette offre.");
  lines.push(`Se désabonner de cette alerte : ${params.unsubscribeUrl}`);
  return {
    subject: `L'offre ${params.offerName} a évolué`,
    text: lines.join("\n"),
  };
}

async function sendAlertEmails(params: {
  offer: ManagedOffer;
  changes: OfferFieldChange[];
  subscriberEmails: { email: string; emailHash: string }[];
}): Promise<{ sent: number; failed: number }> {
  const smtp = smtpEnv();
  if (!smtp || params.subscriberEmails.length === 0) return { sent: 0, failed: 0 };

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.default.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: { user: smtp.user, pass: smtp.password },
  });

  let sent = 0;
  let failed = 0;
  for (const subscriber of params.subscriberEmails) {
    const token = signAlertToken({ e: subscriber.emailHash, s: params.offer.slug });
    const content = buildAlertEmail({
      offerName: params.offer.name,
      changes: params.changes,
      unsubscribeUrl: `${SITE_URL}/api/alerts/unsubscribe?t=${encodeURIComponent(token)}`,
      offerUrl: `${SITE_URL}/offres/${params.offer.slug}`,
    });
    try {
      await transporter.sendMail({
        from: smtp.user,
        to: subscriber.email,
        replyTo: "parrainage@parrainio.fr",
        subject: content.subject,
        text: content.text,
      });
      sent += 1;
    } catch {
      failed += 1;
    }
  }
  return { sent, failed };
}

/**
 * Vérifie une offre (ou toutes) et envoie les alertes consolidées.
 * `dryRun: true` calcule les diffs sans rien écrire ni envoyer (utilisé
 * pour la prévisualisation admin).
 */
export async function runOfferAlertCheck(options: {
  slug?: string;
  dryRun?: boolean;
}): Promise<{ outcomes: OfferAlertOutcome[]; storageReady: boolean; smtpReady: boolean }> {
  const config = getAlertsConfig();
  const targets = options.slug ? [getManagedOffer(options.slug)].filter(Boolean) : getManagedOffers();
  const outcomes: OfferAlertOutcome[] = [];

  for (const offer of targets) {
    if (!offer) continue;
    const signature = computeOfferSignature(offer);
    const lookup = await loadSignature(offer.slug);
    const previous: OfferSignatureRecord | null = lookup.ok ? lookup.value : null;

    if (options.dryRun) {
      // Prévisualisation : compare avec l'empreinte stockée sans modifier l'état.
      const changes = lookup.ok && previous ? diffOfferSignatures(previous.signature ?? "", signature) : [];
      outcomes.push({
        slug: offer.slug,
        status: lookup.ok && previous ? (changes.length > 0 ? "changed-no-subscribers" : "no-change") : (lookup.ok ? "first-reference" : "storage-unavailable"),
        changedFields: changes.map((change) => change.label),
        notifiedCount: 0,
        failedCount: 0,
      });
      continue;
    }

    if (!lookup.ok) {
      // Stockage indisponible ou erreur de lecture : on ne fait rien d'aveugle
      // (sinon un baseline vierge masquerait un vrai changement).
      outcomes.push({ slug: offer.slug, status: "storage-unavailable", changedFields: [], notifiedCount: 0, failedCount: 0 });
      continue;
    }

    if (!previous) {
      // Stockage indisponible ou erreur de lecture : on ne fait rien d'aveugle.
      outcomes.push({ slug: offer.slug, status: "storage-unavailable", changedFields: [], notifiedCount: 0, failedCount: 0 });
      continue;
    }

    if (!previous.signature) {
      await saveSignature(offer.slug, { signature, checkedAt: new Date().toISOString(), changedFields: [] });
      outcomes.push({ slug: offer.slug, status: "first-reference", changedFields: [], notifiedCount: 0, failedCount: 0 });
      continue;
    }

    if (previous.signature === signature) {
      outcomes.push({ slug: offer.slug, status: "no-change", changedFields: [], notifiedCount: 0, failedCount: 0 });
      continue;
    }

    const changes = diffOfferSignatures(previous.signature, signature);
    if (changes.length === 0) {
      // Empreinte modifiée sans champ significatif identifié : on met à jour la référence.
      await saveSignature(offer.slug, { signature, checkedAt: new Date().toISOString(), changedFields: [] });
      outcomes.push({ slug: offer.slug, status: "no-change", changedFields: [], notifiedCount: 0, failedCount: 0 });
      continue;
    }

    const subscribers = await listActiveSubscribers(offer.slug);
    if (!subscribers.ok) {
      outcomes.push({ slug: offer.slug, status: "storage-unavailable", changedFields: changes.map((change) => change.label), notifiedCount: 0, failedCount: 0 });
      continue;
    }

    // Mise à jour de la référence AVANT l'envoi : un changement ne déclenche
    // qu'un seul e-mail consolidé même en cas de relance du check.
    const saved = await saveSignature(offer.slug, {
      signature,
      checkedAt: new Date().toISOString(),
      changedFields: changes.map((change) => change.label),
    });
    if (!saved) {
      outcomes.push({ slug: offer.slug, status: "storage-unavailable", changedFields: changes.map((change) => change.label), notifiedCount: 0, failedCount: 0 });
      continue;
    }

    if (subscribers.value.length === 0) {
      outcomes.push({ slug: offer.slug, status: "changed-no-subscribers", changedFields: changes.map((change) => change.label), notifiedCount: 0, failedCount: 0 });
      continue;
    }

    if (!config.smtpConfigured) {
      outcomes.push({ slug: offer.slug, status: "notify-failed", changedFields: changes.map((change) => change.label), notifiedCount: 0, failedCount: subscribers.value.length });
      continue;
    }

    const result = await sendAlertEmails({
      offer,
      changes,
      subscriberEmails: subscribers.value.map((item) => ({ email: item.email, emailHash: hashEmail(item.email) })),
    });
    outcomes.push({
      slug: offer.slug,
      status: result.failed === 0 ? "notified" : "notify-failed",
      changedFields: changes.map((change) => change.label),
      notifiedCount: result.sent,
      failedCount: result.failed,
    });
  }

  return { outcomes, storageReady: config.storageReady, smtpReady: config.smtpConfigured };
}
