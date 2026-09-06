"use client";

import { useState } from "react";
import styles from "./ReviewList.module.css";

export type ListReview = {
  id: string;
  pseudo: string;
  rating: number;
  date: string;
  text: string;
  offerName: string | null;
  offerSlug: string | null;
};

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return day && month && year ? `${day}/${month}/${year}` : iso;
}

const INITIAL_VISIBLE = 3;

/**
 * Liste d'avis — lecture verticale classique.
 * Les 3 premières cartes sont visibles au chargement ; les suivantes sont
 * rendues dans le HTML (SSR) mais masquées jusqu'au clic sur « Voir les
 * autres avis ». Aucun scroll horizontal, aucune flèche, aucune animation :
 * un simple affichage/masquage vertical.
 */
export default function ReviewList({ reviews }: { reviews: ListReview[] }) {
  const [expanded, setExpanded] = useState(false);
  if (reviews.length === 0) return null;

  const hasHidden = reviews.length > INITIAL_VISIBLE;

  return (
    <div className={styles.list}>
      <div className={styles.grid}>
        {reviews.map((review, index) => (
          <article
            className={styles.card}
            key={review.id}
            hidden={hasHidden && index >= INITIAL_VISIBLE && !expanded}
          >
            <div className={styles.head}>
              <span className={styles.avatar} aria-hidden="true">
                {review.pseudo.slice(0, 1).toUpperCase()}
              </span>
              <div className={styles.identity}>
                <strong>{review.pseudo}</strong>
                <span className={styles.stars} aria-label={`Note : ${review.rating} sur 10`}>
                  <span aria-hidden="true">★★★★★</span>
                  <span className={styles.starsNote}>{review.rating}/10</span>
                </span>
              </div>
            </div>
            <p className={styles.text}>{review.text}</p>
            <div className={styles.foot}>
              {review.offerName && review.offerSlug ? (
                <span className={styles.offer}>
                  Offre concernée :{" "}
                  <a href={`/offres/${review.offerSlug}`}>{review.offerName}</a>
                </span>
              ) : (
                <span />
              )}
              <time className={styles.date} dateTime={review.date}>
                Avis publié le {formatDate(review.date)}
              </time>
            </div>
          </article>
        ))}
      </div>
      {hasHidden ? (
        <p className={styles.toggleRow}>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Masquer les autres avis" : "Voir les autres avis"}
          </button>
        </p>
      ) : null}
    </div>
  );
}
