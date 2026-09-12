import ReviewsManager from "./ReviewsManager";
import { getAllReviewsForAdmin, type Review } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export default async function AdminAvisPage() {
  const reviews: Review[] = await getAllReviewsForAdmin();
  const pendingCount = reviews.filter((review) => review.status === "pending").length;

  return (
    <div className="page">
      <div className="card">
        <h1>Avis clients — modération</h1>
        <p className="muted">
          {pendingCount} avis en attente de validation. Les avis approuvés apparaissent sur{" "}
          <a href="/avis-clients" target="_blank">/avis-clients</a>.
        </p>
        <ReviewsManager reviews={reviews} />
      </div>
      <div className="card">
        <h2>Notes internes</h2>
        <p className="muted">
          Stockage : KV persistant (<code>admin:reviews</code>), fallback
          <code>data/reviews.json</code> — même mécanisme que les offres.
        </p>
      </div>
    </div>
  );
}
