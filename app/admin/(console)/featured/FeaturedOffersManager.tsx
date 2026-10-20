"use client";

import { useState } from "react";
import { saveBoostedSelectionAction } from "@/app/admin/actions";
import type { ManagedOffer } from "@/data/managedOffers";
import type { FeaturedOffersConfig } from "@/data/featuredOffersAdmin";
import type { BoostedCampaignConfig } from "@/data/boostedCampaign";

type FeaturedOffersManagerProps = {
  allOffers: ManagedOffer[];
  featuredConfig: FeaturedOffersConfig;
  campaignConfig: BoostedCampaignConfig;
};

type RewardDraft = { parrainioReward: string; partnerReward: string };

const MAX_OFFERS = 5;

export default function FeaturedOffersManager({
  allOffers,
  featuredConfig,
  campaignConfig,
}: FeaturedOffersManagerProps) {
  // La campagne est la source de vérité du bandeau ; featuredConfig n'est
  // qu'un repli lorsque la campagne n'a pas encore de sélection complète.
  const initialSlugs =
    campaignConfig.offerSlugs.length === MAX_OFFERS
      ? campaignConfig.offerSlugs
      : featuredConfig.featuredOfferSlugs;

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initialSlugs);
  const [rewards, setRewards] = useState<Record<string, RewardDraft>>(() =>
    Object.fromEntries(
      initialSlugs.map((slug) => {
        const boost = campaignConfig.offers[slug];
        const offer = allOffers.find((item) => item.slug === slug);
        return [
          slug,
          {
            parrainioReward: boost?.parrainioReward ?? offer?.parrainioReward ?? "",
            partnerReward: boost?.partnerReward ?? offer?.partnerReward ?? "",
          },
        ];
      }),
    ),
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const availableOffers = allOffers.filter((offer) => !selectedSlugs.includes(offer.slug));

  function draftFor(slug: string): RewardDraft {
    const existing = rewards[slug];
    if (existing) return existing;
    const offer = allOffers.find((item) => item.slug === slug);
    return {
      parrainioReward: offer?.parrainioReward ?? "",
      partnerReward: offer?.partnerReward ?? "",
    };
  }

  function updateReward(slug: string, field: keyof RewardDraft, value: string) {
    setRewards((current) => ({ ...current, [slug]: { ...draftFor(slug), ...current[slug], [field]: value } }));
  }

  function addOffer(slug: string) {
    if (selectedSlugs.length >= MAX_OFFERS) {
      setMessage("Vous ne pouvez sélectionner que 5 offres maximum.");
      return;
    }
    setSelectedSlugs([...selectedSlugs, slug]);
    setRewards((current) => ({ ...current, [slug]: draftFor(slug) }));
    setMessage("");
  }

  function removeOffer(slug: string) {
    setSelectedSlugs(selectedSlugs.filter((item) => item !== slug));
  }

  function moveOffer(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= selectedSlugs.length) return;
    const next = [...selectedSlugs];
    [next[index], next[target]] = [next[target], next[index]];
    setSelectedSlugs(next);
  }

  async function handleSave() {
    if (selectedSlugs.length !== MAX_OFFERS) {
      setMessage("Vous devez sélectionner exactement 5 offres.");
      return;
    }
    const missing = selectedSlugs.find((slug) => !draftFor(slug).parrainioReward.trim());
    if (missing) {
      const name = allOffers.find((offer) => offer.slug === missing)?.name ?? missing;
      setMessage(`Renseignez le reversement Parrainio affiché pour ${name}.`);
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await saveBoostedSelectionAction({
        slugs: selectedSlugs,
        rewards: Object.fromEntries(
          selectedSlugs.map((slug) => {
            const draft = draftFor(slug);
            return [
              slug,
              {
                parrainioReward: draft.parrainioReward.trim(),
                ...(draft.partnerReward.trim() ? { partnerReward: draft.partnerReward.trim() } : {}),
              },
            ];
          }),
        ),
      });
      setMessage("Sélection et montants enregistrés : le bandeau de l’accueil est à jour.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  }

  const selectedOffers = selectedSlugs
    .map((slug) => allOffers.find((offer) => offer.slug === slug))
    .filter((offer): offer is ManagedOffer => Boolean(offer));

  return (
    <div className="featured-manager">
      <div className="featured-section">
        <h2>Offres du bandeau ({selectedSlugs.length}/5)</h2>
        <p className="hint">
          L’ordre ci-dessous est celui du bandeau de l’accueil et de la page
          « Offres boostées ». Les montants saisis ici sont ceux affichés aux
          visiteurs pendant la campagne.
        </p>
        <div className="selected-offers">
          {selectedOffers.map((offer, index) => {
            const draft = draftFor(offer.slug);
            return (
              <div key={offer.slug} className="selected-offer-card">
                <div className="offer-info">
                  <span className="offer-badge">{offer.logoLetter}</span>
                  <div>
                    <strong>{offer.name}</strong>
                    <small>{offer.categoryGroup}</small>
                  </div>
                </div>
                <div className="order-buttons">
                  <button
                    type="button"
                    onClick={() => moveOffer(index, -1)}
                    disabled={index === 0}
                    aria-label={`Monter ${offer.name}`}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveOffer(index, 1)}
                    disabled={index === selectedOffers.length - 1}
                    aria-label={`Descendre ${offer.name}`}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeOffer(offer.slug)}
                    className="remove-button"
                    aria-label={`Retirer ${offer.name}`}
                  >
                    ×
                  </button>
                </div>
                <div className="reward-fields">
                  <label>
                    Prime partenaire affichée
                    <input
                      type="text"
                      value={draft.partnerReward}
                      onChange={(event) => updateReward(offer.slug, "partnerReward", event.target.value)}
                      placeholder="Jusqu'à 160 €"
                    />
                  </label>
                  <label>
                    Reversement Parrainio affiché
                    <input
                      type="text"
                      value={draft.parrainioReward}
                      onChange={(event) => updateReward(offer.slug, "parrainioReward", event.target.value)}
                      placeholder="40 €"
                      required
                    />
                  </label>
                </div>
              </div>
            );
          })}
          {selectedSlugs.length < MAX_OFFERS && (
            <div className="empty-slot">
              <span>+</span>
              <small>Offre à ajouter</small>
            </div>
          )}
        </div>
      </div>

      <div className="available-section">
        <h2>Offres disponibles</h2>
        <div className="available-offers">
          {availableOffers.map((offer) => (
            <div key={offer.slug} className="available-offer-card">
              <div className="offer-info">
                <span className="offer-badge" style={{ backgroundColor: offer.color }}>
                  {offer.logoLetter}
                </span>
                <div>
                  <strong>{offer.name}</strong>
                  <small>{offer.categoryGroup}</small>
                </div>
              </div>
              <button
                type="button"
                onClick={() => addOffer(offer.slug)}
                className="add-button"
                disabled={selectedSlugs.length >= MAX_OFFERS}
              >
                Ajouter
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="actions">
        {message && <p className={message.includes("enregistrés") ? "success" : "error"}>{message}</p>}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || selectedSlugs.length !== MAX_OFFERS}
          className="save-button"
        >
          {saving ? "Sauvegarde..." : "Sauvegarder la sélection"}
        </button>
      </div>

      <style jsx>{`
        .featured-manager {
          max-width: 900px;
          margin: 0 auto;
          padding: 24px;
        }

        .featured-section, .available-section {
          margin-bottom: 32px;
        }

        h2 {
          margin: 0 0 16px;
          color: #075846;
          font-family: "Manrope", Arial, sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .hint {
          margin: -6px 0 16px;
          color: #71807d;
          font-size: 0.85rem;
        }

        .selected-offers, .available-offers {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 12px;
        }

        .selected-offer-card, .available-offer-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px;
          border: 1px solid #e2e8e2;
          border-radius: 12px;
          background: #fff;
        }

        .selected-offer-card {
          flex-wrap: wrap;
          border-color: #075846;
          background: #f0f7f2;
        }

        .offer-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .offer-badge {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #075846;
          color: #fff;
          font-family: "Manrope", Arial, sans-serif;
          font-weight: 800;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .offer-info div {
          min-width: 0;
        }

        .offer-info strong {
          display: block;
          color: #075846;
          font-size: 0.9rem;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .offer-info small {
          display: block;
          color: #71807d;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .order-buttons {
          display: flex;
          gap: 4px;
        }

        .order-buttons button {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border: 1px solid #d8e3db;
          border-radius: 8px;
          background: #fff;
          color: #075846;
          font-size: 0.95rem;
          cursor: pointer;
        }

        .order-buttons button:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .order-buttons .remove-button {
          background: #fee2e2;
          border-color: #fecaca;
          color: #dc2626;
          font-size: 1.1rem;
        }

        .reward-fields {
          flex-basis: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 10px;
        }

        .reward-fields label {
          display: grid;
          gap: 4px;
          color: #40534e;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .reward-fields input {
          padding: 8px 10px;
          border: 1px solid #cbdccf;
          border-radius: 8px;
          font-size: 0.85rem;
        }

        .add-button {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          background: #075846;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .add-button:hover:not(:disabled) {
          background: #043f34;
        }

        .add-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .empty-slot {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          border: 2px dashed #dce6de;
          border-radius: 12px;
          background: #f8faf7;
          color: #899890;
        }

        .empty-slot span {
          font-size: 1.5rem;
          font-weight: 300;
        }

        .empty-slot small {
          font-size: 0.75rem;
        }

        .actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }

        .success {
          color: #059669;
          font-weight: 600;
        }

        .error {
          color: #dc2626;
          font-weight: 600;
        }

        .save-button {
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          background: #075846;
          color: #fff;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .save-button:hover:not(:disabled) {
          background: #043f34;
        }

        .save-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
