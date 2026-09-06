"use client";

import { useTransition } from "react";
import { deleteReviewAction, setReviewStatusAction } from "@/app/admin/actions";
import type { Review } from "@/lib/reviews";
import styles from "../../admin.module.css";

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return d && m && y ? `${d}/${m}/${y}` : iso;
}

const STATUS_LABELS: Record<Review["status"], string> = {
  pending: "En attente",
  approved: "Publié",
  rejected: "Refusé",
};

const STATUS_BADGES: Record<Review["status"], string> = {
  pending: styles.partial,
  approved: styles.ok,
  rejected: styles.ko,
};

export default function ReviewsManager({ reviews }: { reviews: Review[] }) {
  const [isPending, startTransition] = useTransition();

  const run = (action: () => Promise<unknown>) => {
    startTransition(async () => {
      await action();
    });
  };

  if (reviews.length === 0) {
    return <p className={styles.muted}>Aucun avis enregistré.</p>;
  }

  return (
    <div>
      {reviews.map((review) => (
        <div key={review.id} className={styles.listItem}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <strong>{review.pseudo}</strong>
            <span>{review.rating}/10</span>
            <span className={styles.muted}>{formatDate(review.date)}</span>
            <span className={`${styles.badge} ${STATUS_BADGES[review.status]}`}>
              {STATUS_LABELS[review.status]}
            </span>
            {review.offerSlug ? <span className={styles.muted}>· {review.offerSlug}</span> : null}
          </div>
          <p style={{ margin: "6px 0", fontSize: 14 }}>{review.text}</p>
          <div className={styles.itemActions}>
            {review.status !== "approved" ? (
              <button
                className={styles.primary}
                disabled={isPending}
                onClick={() => run(() => setReviewStatusAction(review.id, "approved"))}
              >
                Approuver
              </button>
            ) : null}
            {review.status !== "rejected" ? (
              <button
                className={styles.secondary}
                disabled={isPending}
                onClick={() => run(() => setReviewStatusAction(review.id, "rejected"))}
              >
                Refuser
              </button>
            ) : null}
            {review.status === "approved" ? (
              <button
                className={styles.ghost}
                disabled={isPending}
                onClick={() => run(() => setReviewStatusAction(review.id, "pending"))}
              >
                Repasser en attente
              </button>
            ) : null}
            <button
              className={styles.ghost}
              disabled={isPending}
              onClick={() => {
                if (window.confirm("Supprimer définitivement cet avis ?")) {
                  run(() => deleteReviewAction(review.id));
                }
              }}
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
