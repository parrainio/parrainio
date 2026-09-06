"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ReviewCarousel.module.css";

export type CarouselReview = {
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

export default function ReviewCarousel({ reviews }: { reviews: CarouselReview[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      track.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(":scope > *");
    const step = card ? card.getBoundingClientRect().width + 14 : 340;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  if (reviews.length === 0) return null;

  return (
    <div className={styles.carousel}>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          aria-label="Avis précédent"
          disabled={!canPrev}
          onClick={() => scrollByCard(-1)}
        >
          ←
        </button>
        <button
          type="button"
          className={styles.arrow}
          aria-label="Avis suivant"
          disabled={!canNext}
          onClick={() => scrollByCard(1)}
        >
          →
        </button>
      </div>
      <div className={styles.track} ref={trackRef} tabIndex={0} aria-label="Avis publiés">
        {reviews.map((review) => (
          <article className={styles.card} key={review.id}>
            <div className={styles.cardHead}>
              <span className={styles.avatar} aria-hidden="true">
                {review.pseudo.slice(0, 1).toUpperCase()}
              </span>
              <div className={styles.cardIdentity}>
                <strong>{review.pseudo}</strong>
                <span className={styles.stars} aria-label={`Note : ${review.rating} sur 10`}>
                  <span aria-hidden="true">★★★★★</span>
                  <span className={styles.starsNote}>{review.rating}/10</span>
                </span>
              </div>
            </div>
            <p className={styles.cardText}>{review.text}</p>
            <div className={styles.cardFoot}>
              {review.offerName && review.offerSlug ? (
                <span className={styles.cardOffer}>
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
    </div>
  );
}
