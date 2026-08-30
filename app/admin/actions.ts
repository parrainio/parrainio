"use server";

import { mkdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  adminAuthConfigured,
  clearAdminSession,
  isAdminAuthenticated,
  setAdminSession,
  validAdminPassword,
} from "@/lib/adminAuth";
import {
  getManagedOffer,
  saveOfferOverride,
  toExportRecord,
  getManagedOffers,
  type OfferOverride,
} from "@/data/managedOffers";
import { saveFeaturedOffersConfig, type FeaturedOffersConfig } from "@/data/featuredOffersAdmin";

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
    return { error: "Définissez PARRAINIO_ADMIN_PASSWORD dans .env.local pour activer l’administration." };
  }

  const password = String(formData.get("password") ?? "");
  if (!validAdminPassword(password)) {
    return { error: "Mot de passe incorrect." };
  }

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
  const existing = getManagedOffer(slug);
  if (!existing) throw new Error("Offre introuvable.");

  const override: OfferOverride = {
    name: payload.name.trim() || existing.name,
    category: payload.category.trim() || existing.category,
    description: payload.description,
    partnerReward: payload.partnerReward.trim() || existing.partnerReward,
    parrainioReward: payload.parrainioReward.trim() ? payload.parrainioReward.trim() : null,
    referralCode: payload.referralCode.trim() ? payload.referralCode.trim() : existing.referralCode,
    referralLink: payload.referralLink.trim() ? payload.referralLink.trim() : existing.referralLink,
    officialWebsiteUrl: payload.officialWebsiteUrl.trim() ? payload.officialWebsiteUrl.trim() : null,
    conditions: payload.conditions.map((item) => item.trim()).filter(Boolean),
    steps: payload.steps
      .map((step) => ({ title: step.title.trim(), description: step.description.trim() }))
      .filter((step) => step.title || step.description),
    publicationDate: payload.publicationDate.trim() || existing.publicationDate,
    sourceUrl: payload.sourceUrl.trim() || existing.sourceUrl,
    manualReview: payload.manualReview,
  };

  saveOfferOverride(slug, override);
  revalidatePath("/admin/offres");
  revalidatePath(`/admin/offres/${slug}`);
  revalidatePath(`/offres/${slug}`);
  revalidatePath("/offres");
  return { ok: true };
}

export async function uploadOfferLogoAction(slug: string, formData: FormData) {
  await requireAdmin();
  const existing = getManagedOffer(slug);
  if (!existing) throw new Error("Offre introuvable.");

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

  saveOfferOverride(slug, {
    logo: `/logos/${filename}`,
    logoVerified: true,
  });

  revalidatePath("/admin/offres");
  revalidatePath(`/admin/offres/${slug}`);
  revalidatePath(`/offres/${slug}`);
  revalidatePath("/offres");
  return { ok: true, logo: `/logos/${filename}` };
}

export async function getOffersExportJson() {
  await requireAdmin();
  return JSON.stringify(getManagedOffers().map(toExportRecord), null, 2);
}

export async function saveFeaturedOffersConfigAction(config: FeaturedOffersConfig) {
  await requireAdmin();
  
  if (!config.featuredOfferSlugs || config.featuredOfferSlugs.length !== 4) {
    throw new Error("Vous devez sélectionner exactement 4 offres.");
  }

  const allOffers = getManagedOffers();
  const validSlugs = config.featuredOfferSlugs.filter(slug => 
    allOffers.some(offer => offer.slug === slug)
  );

  if (validSlugs.length !== 4) {
    throw new Error("Certaines offres sélectionnées n'existent pas.");
  }

  saveFeaturedOffersConfig({ featuredOfferSlugs: validSlugs });
  
  revalidatePath("/");
  revalidatePath("/admin/offres");
  revalidatePath("/admin/featured");
  
  return { ok: true };
}
