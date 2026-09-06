import ReviewsManager from "./ReviewsManager";
import { getAllReviewsForAdmin, type Review } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export default function AdminAvisPage() {
  const reviews: Review[] = getAllReviewsForAdmin();
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
          Fichier de données : <code>data/reviews.json</code> (créé au premier passage en
          modération, même mécanisme que <code>data/offer-overrides.json</code>).
        </p>
      </div>
    </div>
  );
}
