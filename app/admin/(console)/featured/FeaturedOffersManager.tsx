"use client";

import { useState } from "react";
import { saveFeaturedOffersConfigAction } from "@/app/admin/actions";
import type { ManagedOffer } from "@/data/managedOffers";
import type { FeaturedOffersConfig } from "@/data/featuredOffersAdmin";

type FeaturedOffersManagerProps = {
  allOffers: ManagedOffer[];
  featuredConfig: FeaturedOffersConfig;
};

export default function FeaturedOffersManager({ allOffers, featuredConfig }: FeaturedOffersManagerProps) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(featuredConfig.featuredOfferSlugs);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const availableOffers = allOffers.filter(offer => !selectedSlugs.includes(offer.slug));

  function addOffer(slug: string) {
    if (selectedSlugs.length >= 4) {
      setMessage("Vous ne pouvez sélectionner que 4 offres maximum.");
      return;
    }
    setSelectedSlugs([...selectedSlugs, slug]);
    setMessage("");
  }

  function removeOffer(slug: string) {
    setSelectedSlugs(selectedSlugs.filter(s => s !== slug));
  }

  async function handleSave() {
    if (selectedSlugs.length !== 4) {
      setMessage("Vous devez sélectionner exactement 4 offres.");
      return;
    }

    setSaving(true);
    setMessage("");
    
    try {
      await saveFeaturedOffersConfigAction({ featuredOfferSlugs: selectedSlugs });
      setMessage("Configuration sauvegardée avec succès.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  }

  const selectedOffers = selectedSlugs.map(slug => allOffers.find(o => o.slug === slug)).filter(Boolean) as ManagedOffer[];

  return (
    <div className="featured-manager">
      <div className="featured-section">
        <h2>Offres sélectionnées ({selectedSlugs.length}/4)</h2>
        <div className="selected-offers">
          {selectedOffers.map((offer) => (
            <div key={offer.slug} className="selected-offer-card">
              <div className="offer-info">
                <span className="offer-badge">{offer.logoLetter}</span>
                <div>
                  <strong>{offer.name}</strong>
                  <small>{offer.categoryGroup}</small>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => removeOffer(offer.slug)}
                className="remove-button"
              >
                ×
              </button>
            </div>
          ))}
          {selectedSlugs.length < 4 && (
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
                disabled={selectedSlugs.length >= 4}
              >
                Ajouter
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="actions">
        {message && <p className={message.includes("succès") ? "success" : "error"}>{message}</p>}
        <button 
          type="button"
          onClick={handleSave}
          disabled={saving || selectedSlugs.length !== 4}
          className="save-button"
        >
          {saving ? "Sauvegarde..." : "Sauvegarder la configuration"}
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

        .remove-button {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border: none;
          border-radius: 8px;
          background: #fee2e2;
          color: #dc2626;
          font-size: 1.2rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .remove-button:hover {
          background: #fecaca;
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
