"use client";

import { useState } from "react";
import CopyTextButton from "@/components/CopyTextButton";
import OfferLogo from "@/components/OfferLogo";
import { esimPromoCodes } from "@/data/esimPromoCodes";
import {
  esimDestinations,
  fixedPlanComparisons,
  providerComparisonNotes,
  unlimitedPlanNotes,
  type EsimDestination,
} from "@/data/esimComparison";
import { getBemoveCopyTrackingUrl } from "@/lib/bemoveTracking";
import styles from "./page.module.css";

type PlanType = "fixed" | "unlimited";

export default function EsimComparison() {
  const [destination, setDestination] = useState<EsimDestination>("united-states");
  const [planType, setPlanType] = useState<PlanType>("fixed");
  const destinationLabel =
    esimDestinations.find((item) => item.id === destination)?.label ?? "États-Unis";
  const fixedPlans = fixedPlanComparisons[destination];

  return (
    <>
      <div className={styles.comparisonFilters}>
        <label className={styles.destinationFilter} htmlFor="esim-destination">
          Destination
          <select
            id="esim-destination"
            value={destination}
            onChange={(event) => {
              const nextDestination = esimDestinations.find(
                (item) => item.id === event.target.value,
              );
              if (nextDestination) setDestination(nextDestination.id);
            }}
          >
            {esimDestinations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <fieldset className={styles.planFilter}>
          <legend>Type de forfait</legend>
          <label>
            <input
              type="radio"
              name="esim-plan-type"
              value="fixed"
              checked={planType === "fixed"}
              onChange={() => setPlanType("fixed")}
            />
            Forfait fixe · 10 Go / 30 jours
          </label>
          <label>
            <input
              type="radio"
              name="esim-plan-type"
              value="unlimited"
              checked={planType === "unlimited"}
              onChange={() => setPlanType("unlimited")}
            />
            Données illimitées
          </label>
        </fieldset>
      </div>

      <p className={styles.filterStatus} aria-live="polite">
        {planType === "fixed"
          ? `Forfaits fixes · ${destinationLabel} · référence 10 Go / 30 jours`
          : `Forfaits annoncés illimités · ${destinationLabel}`}
      </p>

      {planType === "fixed" ? (
        <>
          <div
            className={styles.tableWrap}
            role="region"
            aria-label={`Forfaits fixes eSIM pour ${destinationLabel}`}
            tabIndex={0}
          >
            <table className={styles.table}>
              <caption className={styles.srOnly}>
                Comparaison des forfaits fixes eSIM pour {destinationLabel}, avec une référence de
                10 Go et 30 jours lorsque le tarif est confirmé.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Fournisseur</th>
                  <th scope="col">Forfait de référence</th>
                  <th scope="col">Prix affiché</th>
                  <th scope="col">Particularités vérifiées</th>
                  <th scope="col">Source officielle</th>
                </tr>
              </thead>
              <tbody>
                {fixedPlans.map((plan) => {
                  const offer = esimPromoCodes.find((item) => item.slug === plan.slug);
                  if (!offer) return null;

                  return (
                    <tr key={plan.slug}>
                      <th scope="row">
                        <span className={styles.comparisonBrand}>
                          <OfferLogo
                            name={offer.name}
                            logo={offer.logo}
                            color={offer.color}
                            logoLetter={offer.name.slice(0, 1)}
                            size={36}
                          />
                          {offer.name}
                        </span>
                      </th>
                      <td>{plan.package}</td>
                      <td>
                        {plan.price ? (
                          <strong className={styles.price}>{plan.price}</strong>
                        ) : (
                          <span className={styles.unverified}>Non confirmé</span>
                        )}
                      </td>
                      <td>{plan.note}</td>
                      <td>
                        <a href={plan.sourceUrl} target="_blank" rel="noreferrer">
                          Voir l’offre officielle ↗
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <ul className={styles.mobileComparisonCards}>
            {fixedPlans.map((plan) => {
              const offer = esimPromoCodes.find((item) => item.slug === plan.slug);
              if (!offer) return null;

              return (
                <li className={styles.comparisonCard} key={plan.slug}>
                  <div className={styles.comparisonBrand}>
                    <OfferLogo
                      name={offer.name}
                      logo={offer.logo}
                      color={offer.color}
                      logoLetter={offer.name.slice(0, 1)}
                      size={40}
                    />
                    <h3>{offer.name}</h3>
                  </div>
                  <p>
                    <strong>Forfait :</strong> {plan.package}
                  </p>
                  <p>
                    <strong>Prix :</strong>{" "}
                    {plan.price ? (
                      <span className={styles.price}>{plan.price}</span>
                    ) : (
                      <span className={styles.unverified}>Non confirmé</span>
                    )}
                  </p>
                  <p>{plan.note}</p>
                  <a href={plan.sourceUrl} target="_blank" rel="noreferrer">
                    Voir l’offre officielle ↗
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <div className={styles.unlimitedGrid}>
          {unlimitedPlanNotes.map((plan) => {
            const offer = esimPromoCodes.find((item) => item.slug === plan.slug);
            if (!offer) return null;

            return (
              <article className={styles.unlimitedCard} key={plan.slug}>
                <div className={styles.comparisonBrand}>
                  <OfferLogo
                    name={offer.name}
                    logo={offer.logo}
                    color={offer.color}
                    logoLetter={offer.name.slice(0, 1)}
                    size={40}
                  />
                  <h3>{offer.name}</h3>
                </div>
                <p>{plan.note(destination)}</p>
                <a href={plan.sourceUrl(destination)} target="_blank" rel="noreferrer">
                  Vérifier le forfait officiel ↗
                </a>
              </article>
            );
          })}
        </div>
      )}

      <p className={styles.note}>
        Prix affichés lors du contrôle du 29 octobre 2026, sans conversion entre devises. Les
        montants et disponibilités peuvent changer avant l’achat. « Non confirmé » signifie que
        nous n’avons pas pu vérifier l’offre précise ou son tarif sur le parcours officiel ; aucun
        montant estimé n’est ajouté.
      </p>

      <section className={styles.providerSection} aria-labelledby="provider-notes-heading">
        <div className={styles.sectionHead}>
          <h3 id="provider-notes-heading">Points forts, limites et profils de voyageurs</h3>
        </div>
        <div className={styles.providerGrid}>
          {providerComparisonNotes.map((provider) => {
            const offer = esimPromoCodes.find((item) => item.slug === provider.slug);
            if (!offer) return null;
            return (
              <article className={styles.providerCard} key={provider.slug}>
                <div className={styles.comparisonBrand}>
                  <OfferLogo
                    name={offer.name}
                    logo={offer.logo}
                    color={offer.color}
                    logoLetter={offer.name.slice(0, 1)}
                    size={36}
                  />
                  <h4>{offer.name}</h4>
                </div>
                <p>
                  <strong>Atout :</strong> {provider.strength}
                </p>
                <p>
                  <strong>Limite :</strong> {provider.limit}
                </p>
                <p>
                  <strong>Pour qui :</strong> {provider.suitableFor}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.promoSection} aria-labelledby="promo-heading">
        <div className={styles.sectionHead}>
          <h3 id="promo-heading">Codes promo eSIM annoncés par Bemove</h3>
          <p>
            Chaque bouton copie le code et ouvre le lien affilié Bemove correspondant. Les
            réductions sont celles annoncées par le partenaire ; leur validité et leurs conditions
            doivent être vérifiées avant paiement.
          </p>
        </div>
        <ul className={styles.promoGrid}>
          {esimPromoCodes.map((offer) => (
            <li className={styles.promoCard} key={offer.slug}>
              <div className={styles.comparisonBrand}>
                <OfferLogo
                  name={offer.name}
                  logo={offer.logo}
                  color={offer.color}
                  logoLetter={offer.name.slice(0, 1)}
                  size={40}
                />
                <h4>{offer.name}</h4>
              </div>
              <p>
                Code <code>{offer.code}</code>
              </p>
              <p>{offer.discountPercent} % annoncés par Bemove*</p>
              <CopyTextButton
                value={offer.code}
                label="Copier le code"
                copiedLabel="Code copié ✓"
                openUrlOnClick={getBemoveCopyTrackingUrl(offer.slug)}
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
