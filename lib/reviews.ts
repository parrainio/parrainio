import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REVIEW_PSEUDO_MAX_LENGTH, REVIEW_TEXT_MAX_LENGTH } from "@/lib/reviewLimits";
import {
  ADMIN_KV_KEYS,
  getAdminReviewsCached,
  writeAdminKvJson,
} from "@/lib/adminKv";

export { REVIEW_PSEUDO_MAX_LENGTH, REVIEW_TEXT_MAX_LENGTH };

export type ReviewStatus = "pending" | "approved" | "rejected";

export type Review = {
  id: string;
  pseudo: string;
  rating: number; // 1 → 10
  text: string;
  offerSlug: string | null;
  date: string; // ISO (YYYY-MM-DD) = publication date
  status: ReviewStatus;
  featured?: boolean; // temporary migration flag, removed after write
};

type ReviewFile = {
  reviews: Review[];
};

const dataDir = join(process.cwd(), "data");
const reviewsPath = join(dataDir, "reviews.json");
const VALID_STATUSES: ReviewStatus[] = ["pending", "approved", "rejected"];

// ── Seed reviews (imported verbatim from the owner's screenshot) ──────────────

type SeedReview = {
  pseudo: string;
  date: string; // DD-MM-YYYY as provided
  rating: number;
  text: string;
};

const SEED_REVIEWS: SeedReview[] = [
  {
    pseudo: "astrelya",
    date: "01-08-2026",
    rating: 10,
    text:
      "Mathieu2 est très réactif, il a réalisé le vœu le jour même, sans que j'ai eu besoin de fournir une preuve. Il est très sympathique et professionnel, vous pouvez foncez les yeux fermés, merci encore. J'étais méritant, je me suis inscrit pour pouvoir échanger, et maintenant je cherche de nouveaux parrainages tellement je suis satisfait! Merci à Mathieu et à ce site",
  },
  {
    pseudo: "ledadu93",
    date: "22-07-2026",
    rating: 10,
    text: "Mathieu2 est un parrain sérieux, réactif et fiable. Il tient ses engagements et respecte sa parole. Je le recommande sans hésitation.",
  },
  {
    pseudo: "Jonathan13",
    date: "03-07-2026",
    rating: 10,
    text: "Parrain fiable, réactif et sympathique. Vous pouvez y aller ! Merci ;)",
  },
  {
    pseudo: "rimbaud",
    date: "18-06-2026",
    rating: 10,
    text: "Parrain très réactif. Ça a très bien fonctionné, merci beaucoup.",
  },
  {
    pseudo: "soph tp",
    date: "03-06-2026",
    rating: 10,
    text: "Super réactif et fiable!",
  },
  {
    pseudo: "djmoug",
    date: "09-05-2026",
    rating: 10,
    text: "Promesse tenue, prime convenue remboursée donc très fiable ! Merci",
  },
  {
    pseudo: "Invest63",
    date: "05-05-2026",
    rating: 10,
    text: "Parrain fiable qui tient ses engagements je recommande !",
  },
];

/** DD-MM-YYYY (as provided by the owner) → ISO YYYY-MM-DD */
function seedDateToIso(date: string): string {
  const [day, month, year] = date.split("-");
  return `${year}-${month}-${day}`;
}

function seedReviews(): Review[] {
  return SEED_REVIEWS.map((seed, index) => ({
    id: `seed-${index + 1}`,
    pseudo: seed.pseudo,
    rating: seed.rating,
    text: seed.text,
    offerSlug: null,
    date: seedDateToIso(seed.date),
    status: "approved" as const,
  }));
}

// ── Persistence ───────────────────────────────────────────────────────────────
//
// Source de vérité : le KV (clé admin:reviews) — persistant sur Vercel et
// modifiable depuis l'admin en production. Repli : data/reviews.json (Git) si
// le KV est indisponible ; seeds intégrés seulement si le fichier est absent
// ou corrompu. La soumission publique ET la modération passent par le même
// stockage : plus aucune perte d'avis lors des redéploiements Vercel.

function normalizeReviewFile(raw: unknown): Review[] {
  if (!raw || typeof raw !== "object" || !Array.isArray((raw as ReviewFile).reviews)) {
    return [];
  }
  const cleaned: Review[] = [];
  for (const entry of (raw as ReviewFile).reviews) {
    if (!entry || typeof entry !== "object") continue;
    const review = entry as Partial<Review>;
    if (
      typeof review.id !== "string" ||
      typeof review.pseudo !== "string" ||
      typeof review.rating !== "number" ||
      typeof review.text !== "string" ||
      typeof review.date !== "string" ||
      typeof review.status !== "string" ||
      !VALID_STATUSES.includes(review.status as ReviewStatus)
    ) {
      continue;
    }
    cleaned.push({
      id: review.id,
      pseudo: review.pseudo,
      rating: Math.min(10, Math.max(1, Math.round(review.rating))),
      text: review.text,
      offerSlug:
        typeof review.offerSlug === "string" && review.offerSlug ? review.offerSlug : null,
      date: review.date,
      status: review.status as ReviewStatus,
    });
  }
  return cleaned;
}

async function readAllReviews(): Promise<Review[]> {// 1. KV : dès qu'une liste y est stockée, elle est la source de vérité —
//    y compris si elle devient vide (avis tous supprimés : aucun retour
//    fantôme des seeds). Le seed idempotent copie le JSON Git dans le KV —
//    déclenché par les chemins d'ÉCRITURE uniquement : les lecteurs sont
//    rendus dans des pages (parfois statiques) et le seed émet des fetch
//    no-store, interdits pendant le rendu (React #441).
  const stored = (await getAdminReviewsCached()) as ReviewFile | null;
  if (stored && Array.isArray((stored as ReviewFile).reviews)) {
    // Drop the temporary migration flag if it ever gets persisted.
    return normalizeReviewFile(stored).map(({ featured: _featured, ...review }) => review);
  }

  // 2. Fallback Git : data/reviews.json matérialise le contenu initial.
  if (existsSync(reviewsPath)) {
    try {
      const parsed: unknown = JSON.parse(readFileSync(reviewsPath, "utf8"));
      return normalizeReviewFile(parsed);
    } catch {
      return seedReviews();
    }
  }

  // 3. Dernier repli : seeds (premier déploiement sans le fichier).
  return seedReviews();
}

/** Écrit la liste complète. Retourne false si le KV est indisponible (l'appelant décide). */
async function writeAllReviews(reviews: Review[]): Promise<boolean> {
  const persisted = await writeAdminKvJson(ADMIN_KV_KEYS.reviews, { reviews });
  if (persisted) return true;
  // Repli fichier (local uniquement). Sur Vercel le FS est en lecture seule :
  // l'écriture lèverait EROFS (crash Server Action / API — surface client
  // React #441). persisted=false informe l'appelant (admin/API).
  if (!process.env.VERCEL_ENV) {
    mkdirSync(dataDir, { recursive: true });
    writeFileSync(reviewsPath, `${JSON.stringify({ reviews }, null, 2)}\n`, "utf8");
  }
  return false;
}

// ── Public readers ────────────────────────────────────────────────────────────

export type PublicReview = {
  id: string;
  pseudo: string;
  rating: number;
  text: string;
  offerSlug: string | null;
  date: string;
};

/** Approved reviews only, newest first. */
export async function getApprovedReviews(): Promise<PublicReview[]> {
  return (await readAllReviews())
    .filter((review) => review.status === "approved")
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .map(({ id, pseudo, rating, text, offerSlug, date }) => ({
      id,
      pseudo,
      rating,
      text,
      offerSlug,
      date,
    }));
}

export type ReviewsStats = {
  count: number;
  /** Formatted for display: "10" or "9,3". Empty when no approved review. */
  average: string;
};

/** Dynamic stats from actual published (approved) reviews — no invented numbers. */
export async function getReviewsStats(): Promise<ReviewsStats> {
  const approved = (await readAllReviews()).filter((review) => review.status === "approved");
  if (approved.length === 0) return { count: 0, average: "—" };
  const total = approved.reduce((sum, review) => sum + review.rating, 0);
  const average = total / approved.length;
  const formatted = Number.isInteger(average)
    ? String(average)
    : (Math.round(average * 10) / 10).toFixed(1).replace(".", ",");
  return { count: approved.length, average: formatted };
}

// ── Admin helpers ─────────────────────────────────────────────────────────────

export async function getAllReviewsForAdmin(): Promise<Review[]> {
  return (await readAllReviews()).sort((a, b) => {
    if (a.status !== b.status) {
      const order: Record<ReviewStatus, number> = { pending: 0, approved: 1, rejected: 2 };
      return order[a.status] - order[b.status];
    }
    return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
  });
}

function nextReviewId(reviews: Review[]): string {
  const numeric = reviews
    .map((review) => Number.parseInt(review.id.replace(/^rev-/, ""), 10))
    .filter((value) => Number.isInteger(value));
  const max = numeric.length > 0 ? Math.max(...numeric) : 0;
  return `rev-${max + 1}`;
}

export async function addPendingReview(input: {
  pseudo: string;
  rating: number;
  text: string;
  offerSlug: string | null;
}): Promise<{ review: Review; persisted: boolean }> {
  const reviews = await readAllReviews();
  const review: Review = {
    id: nextReviewId(reviews),
    pseudo: input.pseudo,
    rating: input.rating,
    text: input.text,
    offerSlug: input.offerSlug,
    date: new Date().toISOString().slice(0, 10),
    status: "pending",
  };
  const persisted = await writeAllReviews([...reviews, review]);
  return { review, persisted };
}

/**
 * Change le statut d'un avis. Retourne { ok, persisted } :
 * ok = l'avis existe ; persisted = l'écriture a atteint le stockage persistant.
 */
export async function setReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<{ ok: boolean; persisted: boolean }> {
  const reviews = await readAllReviews();
  const index = reviews.findIndex((review) => review.id === id);
  if (index === -1) return { ok: false, persisted: false };
  reviews[index] = { ...reviews[index], status };
  const persisted = await writeAllReviews(reviews);
  return { ok: true, persisted };
}

export async function deleteReview(id: string): Promise<{ ok: boolean; persisted: boolean }> {
  const reviews = await readAllReviews();
  const next = reviews.filter((review) => review.id !== id);
  if (next.length === reviews.length) return { ok: false, persisted: false };
  const persisted = await writeAllReviews(next);
  return { ok: true, persisted };
}

// ── Server-side validation for the public submission endpoint ────────────────

const controlChars = /[\u0000-\u001f\u007f]/g;

export function cleanReviewInput(value: unknown, max: number): string {
  return String(value ?? "")
    .replace(controlChars, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export type ValidatedReviewInput =
  | { ok: true; value: { pseudo: string; rating: number; text: string; offerSlug: string | null } }
  | { ok: false; error: string };

export function validateReviewSubmission(body: unknown): ValidatedReviewInput {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, error: "Requête invalide." };
  }
  const data = body as Record<string, unknown>;

  // Honeypot: must stay empty (bots fill every field).
  if (cleanReviewInput(data.website, 100)) {
    return { ok: false, error: "Requête invalide." };
  }

  const pseudo = cleanReviewInput(data.pseudo, REVIEW_PSEUDO_MAX_LENGTH);
  const text = cleanReviewInput(data.text, REVIEW_TEXT_MAX_LENGTH);
  const ratingRaw = Number(data.rating);
  const offerSlug =
    typeof data.offerSlug === "string" && data.offerSlug ? data.offerSlug.slice(0, 120) : null;

  if (!pseudo || !text) {
    return { ok: false, error: "Veuillez renseigner votre pseudo et votre avis." };
  }
  if (!Number.isInteger(ratingRaw) || ratingRaw < 1 || ratingRaw > 10) {
    return { ok: false, error: "La note doit être un nombre entier entre 1 et 10." };
  }

  return { ok: true, value: { pseudo, rating: ratingRaw, text, offerSlug } };
}

// ── Naive in-memory rate limiting (per server instance) ───────────────────────

const recentSubmissions = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (recentSubmissions.get(key) ?? []).filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX) {
    return true;
  }
  timestamps.push(now);
  recentSubmissions.set(key, timestamps);
  if (recentSubmissions.size > 1000) {
    for (const [mapKey, times] of recentSubmissions) {
      if (times.every((time) => now - time >= RATE_LIMIT_WINDOW_MS)) {
        recentSubmissions.delete(mapKey);
      }
    }
  }
  return false;
}

export function reviewsStoragePath(): string {
  return reviewsPath;
}
