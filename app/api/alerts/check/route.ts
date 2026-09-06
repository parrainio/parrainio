import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { runOfferAlertCheck } from "@/lib/alertRunner";

/**
 * Déclencheur de la détection de changements — réservé à l'administration
 * (session admin existante, jamais exposé aux visiteurs anonymes).
 *
 * POST { slug?: string, dryRun?: boolean }
 *  - sans `slug` : vérifie toutes les offres ;
 *  - `dryRun: true` : calcule les diffs sans écrire ni envoyer
 *    (prévisualisation depuis la console admin).
 *
 * Usage prévu : appel manuel depuis la console admin après une mise à jour
 * d'offre, ou hook post-déploiement authentifié. Aucun cron, aucun
 * déclenchement au rendu de page.
 */

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 401 });
  }

  let body: { slug?: unknown; dryRun?: unknown } = {};
  try {
    body = (await request.json()) as { slug?: unknown; dryRun?: unknown };
  } catch {
    body = {};
  }

  const slug = typeof body.slug === "string" ? body.slug.slice(0, 120) : undefined;
  const dryRun = body.dryRun === true;

  const result = await runOfferAlertCheck({ slug, dryRun });
  return NextResponse.json(result);
}
