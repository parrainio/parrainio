"use server";

import { mkdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  adminAuthConfigured,
  clearAdminSession,
  isAdminAuthenticated,
  setAdminSession,
  validAdminPassword,
} from "@/lib/adminAuth";
import {
  clearLoginFailures,
  loginBlockedForSeconds,
  recordLoginFailure,
} from "@/lib/adminRateLimit";
import {
  getManagedOffer,
  saveOfferOverride,
  toExportRecord,
  getManagedOffers,
  type OfferOverride,
} from "@/data/managedOffers";
import { saveFeaturedOffersConfig, type FeaturedOffersConfig } from "@/data/featuredOffersAdmin";
import {
  deleteReview,
  setReviewStatus,
  type ReviewStatus,
} from "@/lib/reviews";

/**
 * Message affiché quand les variables d'authentification admin ne sont pas
 * configurées dans l'environnement courant (production Vercel ou local).
 */
function adminDisabledMessage(): string {
  return "Administration désactivée : ajoutez PARRAINIO_ADMIN_PASSWORD et PARRAINIO_ADMIN_SESSION_SECRET dans les variables d'environnement pour activer cet espace.";
}

/** IP du client (en-têtes proxy Vercel). Jamais journalisée.
 *  Dérogation de test : globalThis.__parrainioTestIp (QA uniquement). */
async function getClientIp(): Promise<string> {
  const override = (globalThis as { __parrainioTestIp?: string }).__parrainioTestIp;
  if (override) return override;
  const requestHeaders = await headers();
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown"
  );
}

/** URL http(s) ou null — refuse tout autre protocole (javascript:, data:, …). */
function sanitizeHttpUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Accès administrateur requis.");
  }
}

export async function loginAdmin(
  _prev: { error?: string } | null,
  formData: FormData,
) {
  if (!adminAuthConfigured()) {
    return { error: adminDisabledMessage() };
  }

  const ip = await getClientIp();
  const blockedFor = await loginBlockedForSeconds(ip);
  if (blockedFor > 0) {
    const minutes = Math.ceil(blockedFor / 60);
    return {
      error: `Trop de tentatives échouées. Réessayez dans environ ${minutes} minute${minutes > 1 ? "s" : ""}.`,
    };
  }

  const password = String(formData.get("password") ?? "");
  if (!validAdminPassword(password)) {
    const waitSeconds = await recordLoginFailure(ip);
    if (waitSeconds > 0) {
      return {
        error: `Mot de passe incorrect. Trop de tentatives : nouvelle tentative possible dans environ ${Math.ceil(waitSeconds / 60)} minute(s).`,
      };
    }
    return { error: "Mot de passe incorrect." };
  }

  await clearLoginFailures(ip);
  await setAdminSession();
  redirect("/admin/offres");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export type OfferSavePayload = {
  name: string;
  category: string;
  description: string;
  partnerReward: string;
  parrainioReward: string;
  referralCode: string;
  referralLink: string;
  officialWebsiteUrl: string;
  conditions: string[];
  steps: { title: string; description: string }[];
  publicationDate: string;
  sourceUrl: string;
  manualReview: boolean;
};

export async function saveOfferAction(slug: string, payload: OfferSavePayload) {
  await requireAdmin();
  const existing = await getManagedOffer(slug);
  if (!existing) throw new Error("Offre introuvable.");

  // Les URLs sont strictement validées : http(s) uniquement, protocoles
  // dangereux (javascript:, data:, …) refusés, espaces parasites nettoyés.
  const referralLink = payload.referralLink.trim()
    ? sanitizeHttpUrl(payload.referralLink)
    : null;
  const officialWebsiteUrl = payload.officialWebsiteUrl.trim()
    ? sanitizeHttpUrl(payload.officialWebsiteUrl)
    : null;
  const sourceUrl = payload.sourceUrl.trim() ? sanitizeHttpUrl(payload.sourceUrl) : null;
  if (payload.referralLink.trim() && !referralLink) {
    throw new Error("Lien de parrainage invalide : utilisez une URL http(s) complète.");
  }
  if (payload.officialWebsiteUrl.trim() && !officialWebsiteUrl) {
    throw new Error("Site officiel invalide : utilisez une URL http(s) complète.");
  }
  if (payload.sourceUrl.trim() && !sourceUrl) {
    throw new Error("Source invalide : utilisez une URL http(s) complète.");
  }

  const conditions = Array.isArray(payload.conditions)
    ? payload.conditions.map((item) => String(item ?? "").trim()).filter(Boolean)
    : existing.conditions;
  const steps = Array.isArray(payload.steps)
    ? payload.steps
        .map((step) => ({
          title: String(step?.title ?? "").trim(),
          description: String(step?.description ?? "").trim(),
        }))
        .filter((step) => step.title || step.description)
    : existing.steps;

  const override: OfferOverride = {
    name: payload.name.trim() || existing.name,
    category: payload.category.trim() || existing.category,
    description: payload.description,
    partnerReward: payload.partnerReward.trim() || existing.partnerReward,
    parrainioReward: payload.parrainioReward.trim() ? payload.parrainioReward.trim() : null,
    referralCode: payload.referralCode.trim() ? payload.referralCode.trim() : existing.referralCode,
    referralLink,
    officialWebsiteUrl,
    conditions,
    steps,
    publicationDate: payload.publicationDate.trim() || existing.publicationDate,
    sourceUrl: sourceUrl ?? undefined,
    manualReview: payload.manualReview,
  };

  const { persisted, offer } = await saveOfferOverride(slug, override);
  if (!persisted) {
    throw new Error(
      "Stockage persistant indisponible : la modification n'a pas pu être enregistrée durablement. Réessayez plus tard.",
    );
  }

  /* Publication immédiate : revalidation des pages qui affichent cette offre
     (fiche, catalogue, classement, hub de catégorie, homepage, sitemap).
     Les pages fiche/catalogue sont déjà dynamiques ; la revalidation met à
     jour les surfaces statiques ou ISR et rafraîchit le sitemap. */
  revalidatePath("/admin/offres");
  revalidatePath(`/admin/offres/${slug}`);
  revalidatePath(`/offres/${slug}`);
  revalidatePath("/offres");
  revalidatePath("/classement-primes-parrainage");
  revalidatePath(`/categories/${existing.categoryGroup}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  /* IndexNow : soumission de la fiche modifiée + listes publiques.
     Réutilise le module existant SANS le modifier — submitIndexNow() est un
     no-op hors production et filtre lui-même les URLs canoniques. */
  try {
    const { submitIndexNow } = await import("@/lib/indexNow");
    await submitIndexNow([
      `/offres/${slug}`,
      "/offres",
      "/classement-primes-parrainage",
    ]);
  } catch (error) {
    console.warn(
      "[indexnow] soumission admin ignorée :",
      error instanceof Error ? error.message : error,
    );
  }

  return { ok: true };
}

export async function uploadOfferLogoAction(slug: string, formData: FormData) {
  await requireAdmin();
  const existing = await getManagedOffer(slug);
  if (!existing) throw new Error("Offre introuvable.");

  /* Le filesystem Vercel est éphémère : un logo téléversé en production
     disparaîtrait au prochain redéploiement (et ne serait pas servi). Le
     stockage persistant des logos est explicitement hors périmètre —
     l'upload reste disponible en local uniquement. */
  if (process.env.VERCEL_ENV) {
    throw new Error(
      "Le remplacement de logo n'est pas disponible en production (stockage de fichiers). Passez par le dépôt Git.",
    );
  }

  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choisissez un fichier logo.");
  }
  if (file.size > 2_000_000) {
    throw new Error("Le logo ne doit pas dépasser 2 Mo.");
  }

  const extension = extname(file.name).toLowerCase() || ".png";
  const allowed = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico"];
  if (!allowed.includes(extension)) {
    throw new Error("Formats acceptés : PNG, JPG, WEBP, SVG.");
  }

  const directory = join(process.cwd(), "public", "logos");
  mkdirSync(directory, { recursive: true });
  const filename = `${slug}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(join(directory, filename), buffer);

  const { persisted } = await saveOfferOverride(slug, {
    logo: `/logos/${filename}`,
    logoVerified: true,
  });
  if (!persisted) {
    throw new Error(
      "Stockage persistant indisponible : le logo n'a pas pu être enregistré durablement.",
    );
  }

  revalidatePath("/admin/offres");
  revalidatePath(`/admin/offres/${slug}`);
  revalidatePath(`/offres/${slug}`);
  revalidatePath("/offres");
  return { ok: true, logo: `/logos/${filename}` };
}

export async function getOffersExportJson() {
  await requireAdmin();
  return JSON.stringify((await getManagedOffers()).map(toExportRecord), null, 2);
}

export async function saveFeaturedOffersConfigAction(config: FeaturedOffersConfig) {
  await requireAdmin();

  if (!config.featuredOfferSlugs || config.featuredOfferSlugs.length !== 5) {
    throw new Error("Vous devez sélectionner exactement 5 offres.");
  }

  const allOffers = await getManagedOffers();
  const validSlugs = config.featuredOfferSlugs.filter(slug =>
    allOffers.some(offer => offer.slug === slug)
  );

  if (validSlugs.length !== 5) {
    throw new Error("Certaines offres sélectionnées n'existent pas.");
  }

  const persisted = await saveFeaturedOffersConfig({ featuredOfferSlugs: validSlugs });
  if (!persisted) {
    throw new Error(
      "Stockage persistant indisponible : la configuration n'a pas pu être enregistrée durablement.",
    );
  }

  revalidatePath("/");
  revalidatePath("/admin/offres");
  revalidatePath("/admin/featured");

  return { ok: true };
}

export async function setReviewStatusAction(id: string, status: ReviewStatus) {
  await requireAdmin();
  const result = await setReviewStatus(id, status);
  if (!result.ok) {
    throw new Error("Avis introuvable.");
  }
  if (!result.persisted) {
    throw new Error(
      "Stockage persistant indisponible : la modération n'a pas pu être enregistrée durablement.",
    );
  }
  revalidatePath("/admin/avis");
  revalidatePath("/avis-clients");
  return { ok: true };
}

export async function deleteReviewAction(id: string) {
  await requireAdmin();
  const result = await deleteReview(id);
  if (!result.ok) {
    throw new Error("Avis introuvable.");
  }
  if (!result.persisted) {
    throw new Error(
      "Stockage persistant indisponible : la suppression n'a pas pu être enregistrée durablement.",
    );
  }
  revalidatePath("/admin/avis");
  revalidatePath("/avis-clients");
  return { ok: true };
}
