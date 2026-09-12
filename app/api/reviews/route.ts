import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  addPendingReview,
  cleanReviewInput,
  isRateLimited,
  validateReviewSubmission,
} from "@/lib/reviews";
import { getManagedOffer } from "@/data/managedOffers";

/**
 * Public review submission endpoint.
 *
 * Reviews are never published directly: they are stored with the "pending"
 * status and only appear on /avis-clients once approved from the admin console.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const validated = validateReviewSubmission(body);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (isRateLimited(`reviews:${ip}`)) {
      return NextResponse.json(
        { error: "Vous avez déjà envoyé plusieurs avis récemment. Merci de réessayer plus tard." },
        { status: 429 }
      );
    }

    let offerSlug: string | null = validated.value.offerSlug;
    if (offerSlug && !(await getManagedOffer(offerSlug))) {
      offerSlug = null;
    }

    const { review, persisted } = await addPendingReview({
      pseudo: cleanReviewInput(validated.value.pseudo, 40),
      rating: validated.value.rating,
      text: validated.value.text,
      offerSlug,
    });

    // KV indisponible : on refuse honnêtement plutôt que de perdre l'avis
    // (en production, le repli fichier serait de toute façon éphémère).
    if (!persisted) {
      return NextResponse.json(
        { error: "Impossible d’enregistrer votre avis pour le moment. Veuillez réessayer dans quelques instants." },
        { status: 503 }
      );
    }

    revalidatePath("/avis-clients");
    return NextResponse.json({ ok: true, id: review.id });
  } catch {
    return NextResponse.json(
      { error: "Impossible d’envoyer votre avis pour le moment. Veuillez réessayer dans quelques instants." },
      { status: 500 }
    );
  }
}
