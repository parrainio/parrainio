"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import OfferLogo from "@/components/OfferLogo";
import { saveOfferAction, uploadOfferLogoAction } from "@/app/admin/actions";
import styles from "../../../admin.module.css";

type EditorOffer = {
  slug: string;
  name: string;
  category: string;
  description: string;
  partnerReward: string;
  parrainioReward: string;
  referralCode: string;
  referralLink: string;
  officialWebsiteUrl: string;
  conditions: string[];
  steps: { title: string; description: string }[];
  publicationDate: string;
  sourceUrl: string;
  logo: string | null;
  logoVerified: boolean;
  color: string;
  logoLetter: string;
  manualReview: boolean;
};

function moveItem<T>(list: T[], index: number, direction: -1 | 1) {
  const next = [...list];
  const target = index + direction;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export default function OfferEditor({ offer }: { offer: EditorOffer }) {
  const [name, setName] = useState(offer.name);
  const [category, setCategory] = useState(offer.category);
  const [description, setDescription] = useState(offer.description);
  const [partnerReward, setPartnerReward] = useState(offer.partnerReward);
  const [parrainioReward, setParrainioReward] = useState(offer.parrainioReward);
  const [referralCode, setReferralCode] = useState(offer.referralCode);
  const [referralLink, setReferralLink] = useState(offer.referralLink);
  const [officialWebsiteUrl, setOfficialWebsiteUrl] = useState(offer.officialWebsiteUrl || "");
  const [conditions, setConditions] = useState(offer.conditions.length ? offer.conditions : [""]);
  const [steps, setSteps] = useState(
    offer.steps.length ? offer.steps : [{ title: "", description: "" }],
  );
  const [publicationDate, setPublicationDate] = useState(offer.publicationDate);
  const [sourceUrl, setSourceUrl] = useState(offer.sourceUrl);
  const [manualReview, setManualReview] = useState(offer.manualReview);
  const [logo, setLogo] = useState(offer.logo);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await saveOfferAction(offer.slug, {
        name,
        category,
        description,
        partnerReward,
        parrainioReward,
        referralCode,
        referralLink,
        officialWebsiteUrl,
        conditions,
        steps,
        publicationDate,
        sourceUrl,
        manualReview,
      });
      setMessage("Modifications enregistrées. La page publique utilise déjà ces informations.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await uploadOfferLogoAction(offer.slug, formData);
    setLogo(result.logo);
    setMessage("Logo mis à jour.");
  }

  return (
    <main className={styles.editorPage}>
      <div className={styles.editorHeader}>
        <div>
          <Link href="/admin/offres" className={styles.muted}>
            ← Toutes les offres
          </Link>
          <h1 style={{ margin: "8px 0 0", color: "#075846", fontFamily: "Manrope, Arial, sans-serif" }}>
            {offer.name}
          </h1>
        </div>
        <div className={styles.actions}>
          <Link className={styles.ghost} href={`/offres/${offer.slug}`} target="_blank">
            Prévisualiser l&apos;offre
          </Link>
          <button className={styles.primary} form="offer-editor" type="submit">
            {saving ? "Enregistrement…" : "Enregistrer les modifications"}
          </button>
        </div>
      </div>

      <section className={`${styles.section} ${styles.card}`}>
        <h2>Logo</h2>
        <div className={styles.logoRow}>
          <OfferLogo
            color={offer.color}
            logo={logo}
            logoLetter={offer.logoLetter}
            name={name}
            size={64}
          />
          <div>
            <p className={styles.muted}>
              {logo ? (offer.logoVerified ? "Logo ✓" : "Logo à vérifier") : "Aucun logo — initiales utilisées"}
            </p>
            <form onSubmit={handleLogo} style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input accept="image/png,image/jpeg,image/webp,image/svg+xml" name="logo" type="file" />
              <button className={styles.secondary} type="submit">
                Remplacer le logo
              </button>
            </form>
          </div>
        </div>
      </section>

      <form id="offer-editor" onSubmit={handleSave}>
        <section className={`${styles.section} ${styles.card}`}>
          <h2>Informations générales</h2>
          <div className={styles.grid}>
            <label className={styles.field}>
              Nom de l&apos;entreprise
              <input onChange={(event) => setName(event.target.value)} value={name} />
            </label>
            <label className={styles.field}>
              Slug
              <input readOnly value={offer.slug} />
            </label>
            <label className={styles.field}>
              Catégorie
              <input onChange={(event) => setCategory(event.target.value)} value={category} />
            </label>
            <label className={styles.field}>
              Date de publication
              <input onChange={(event) => setPublicationDate(event.target.value)} value={publicationDate} />
            </label>
          </div>
          <label className={styles.field}>
            Description courte
            <textarea onChange={(event) => setDescription(event.target.value)} value={description} />
          </label>
        </section>

        <section className={`${styles.section} ${styles.card}`}>
          <h2>Récompenses</h2>
          <div className={styles.grid}>
            <label className={styles.field}>
              Bonus officiel du partenaire
              <input onChange={(event) => setPartnerReward(event.target.value)} value={partnerReward} />
            </label>
            <label className={styles.field}>
              Récompense Parrainio
              <input onChange={(event) => setParrainioReward(event.target.value)} value={parrainioReward} />
            </label>
          </div>
        </section>

        <section className={`${styles.section} ${styles.card}`}>
          <h2>Parrainage</h2>
          <div className={styles.grid}>
            <label className={styles.field}>
              Code de parrainage
              <input onChange={(event) => setReferralCode(event.target.value)} value={referralCode} />
            </label>
            <label className={styles.field}>
              Lien de parrainage
              <input onChange={(event) => setReferralLink(event.target.value)} value={referralLink} />
            </label>
          </div>
          <label className={styles.field}>
            Site internet officiel
            <input 
              onChange={(event) => setOfficialWebsiteUrl(event.target.value)} 
              value={officialWebsiteUrl}
              placeholder="https://example.com"
              type="url"
            />
          </label>
          <label className={styles.field}>
            Source
            <input onChange={(event) => setSourceUrl(event.target.value)} value={sourceUrl} />
          </label>
          <label className={styles.field} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              checked={manualReview}
              onChange={(event) => setManualReview(event.target.checked)}
              type="checkbox"
            />
            Marquer comme à vérifier
          </label>
        </section>

        <section className={`${styles.section} ${styles.card}`}>
          <h2>Conditions</h2>
          {conditions.map((condition, index) => (
            <div className={styles.listItem} key={`condition-${index}`}>
              <input
                onChange={(event) =>
                  setConditions((current) =>
                    current.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)),
                  )
                }
                value={condition}
              />
              <div className={styles.itemActions}>
                <button onClick={() => setConditions((current) => moveItem(current, index, -1))} type="button">
                  ↑
                </button>
                <button onClick={() => setConditions((current) => moveItem(current, index, 1))} type="button">
                  ↓
                </button>
                <button
                  onClick={() => setConditions((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  type="button"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          <button className={styles.ghost} onClick={() => setConditions((current) => [...current, ""])} type="button">
            Ajouter une condition
          </button>
        </section>

        <section className={`${styles.section} ${styles.card}`}>
          <h2>Étapes</h2>
          {steps.map((step, index) => (
            <div className={styles.listItem} key={`step-${index}`}>
              <div>
                <input
                  onChange={(event) =>
                    setSteps((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, title: event.target.value } : item,
                      ),
                    )
                  }
                  placeholder={`Étape ${index + 1}`}
                  value={step.title}
                />
                <textarea
                  onChange={(event) =>
                    setSteps((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, description: event.target.value } : item,
                      ),
                    )
                  }
                  placeholder="Description"
                  style={{ marginTop: 8 }}
                  value={step.description}
                />
              </div>
              <div className={styles.itemActions}>
                <button onClick={() => setSteps((current) => moveItem(current, index, -1))} type="button">
                  ↑
                </button>
                <button onClick={() => setSteps((current) => moveItem(current, index, 1))} type="button">
                  ↓
                </button>
                <button
                  onClick={() => setSteps((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  type="button"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          <button
            className={styles.ghost}
            onClick={() => setSteps((current) => [...current, { title: "", description: "" }])}
            type="button"
          >
            Ajouter une étape
          </button>
        </section>

        {message ? <p className={styles.success}>{message}</p> : null}
        <button className={styles.primary} disabled={saving} type="submit">
          Enregistrer les modifications
        </button>
      </form>
    </main>
  );
}
