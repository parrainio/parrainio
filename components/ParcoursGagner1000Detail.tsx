import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import PublicHeaderServer from "@/components/PublicHeaderServer";
import SiteFooter from "@/components/SiteFooter";
import { getManagedOffers } from "@/data/managedOffers";
import type { ParrainioParcours } from "@/data/parcoursGagner1000";
import { PARCOURS_A, PARCOURS_B } from "@/data/parcoursGagner1000";
import { SITE_URL } from "@/lib/siteUrl";
import styles from "./ParcoursGagner1000Pages.module.css";

const milestones = [100, 200, 300] as const;

/** Montants (ex. « 1 017,50 € ») : insécables pour éviter toute coupure dans le nombre. */
const AMOUNT_PATTERN = /(\d+(?:[\s\u00a0]\d{3})*(?:,\d+)?\s*€)/g;

function withWholeAmounts(text: string) {
  return text.split(AMOUNT_PATTERN).map((part, index) =>
    index % 2 === 1 ? (
      <span className={styles.amountNowrap} key={index}>{part}</span>
    ) : (
      part
    ),
  );
}

type FaqItem = { question: string; answer: string };

function faqFor(parcours: ParrainioParcours): FaqItem[] {
  const steps = parcours.key === "a" ? "11" : "12";
  const early = parcours.key === "a" ? "7" : "8";
  return [
    {
      question: `Combien peut-on gagner avec le ${parcours.shortTitle.toLowerCase()} ?`,
      answer: `Le scénario illustré cumule ${parcours.total} après ${steps} étapes, dont ${parcours.earlyTotal} dès la ${early}ᵉ étape. Ces montants reprennent l’infographie : ils ne sont pas garantis et dépendent de l’éligibilité, des dépôts demandés et de la validation de chaque offre.`,
    },
    {
      question: "Faut-il beaucoup d’argent pour commencer ce parcours ?",
      answer:
        parcours.key === "a"
          ? "Non : la première étape Hello bank! est indiquée avec 0 € de dépôt. Les étapes suivantes demandent parfois un dépôt (100 € chez eToro, 20 € chez Coinbase, 200 € chez Kraken, 300 € chez Fortuneo et BoursoBank), mais il s’agit de sommes déposées sur un compte, pas de frais définitifs."
          : "Non : la première étape BNP Paribas est indiquée avec 0 € de dépôt, et XTB demande 1 €. Certaines étapes demandent davantage (200 € chez Kraken, 300 € chez Fortuneo et BoursoBank) ; ce sont des dépôts sur un compte, à retirer selon les conditions du partenaire.",
    },
    {
      question: "Combien de temps faut-il pour atteindre 1 000 € ?",
      answer: `Le délai total indicatif de l’infographie est de ${parcours.totalDelay}. Il dépend de la validation de chaque dossier, des opérations demandées et des délais de versement des partenaires.`,
    },
    {
      question: "Peut-on cumuler plusieurs offres de parrainage ?",
      answer:
        "Oui, à condition que chaque offre soit souscrite séparément et que vous respectiez ses propres conditions d’éligibilité. Les primes sont versées par des établissements différents : elles s’additionnent dans le scénario, mais chacune reste soumise à sa validation.",
    },
    {
      question: "Les dépôts sont-ils perdus ?",
      answer:
        "Non. Les dépôts demandés sont crédités sur les comptes ou applications concernés. Leur retrait dépend toutefois des conditions du partenaire (durée de conservation, opérations minimales, frais éventuels) : lisez la fiche de chaque offre avant d’engager une somme.",
    },
    {
      question: "Que faire si une offre du parcours n’est plus disponible ?",
      answer:
        "Remplacez-la par une autre offre du catalogue Parrainio présentant un montant et des conditions comparables. Le total du scénario est indicatif : il ne constitue pas un engagement des partenaires.",
    },
  ];
}

export default async function ParcoursGagner1000Detail({ parcours }: { parcours: ParrainioParcours }) {
  await connection();
  const offers = await getManagedOffers();
  const offerBySlug = new Map(offers.map((offer) => [offer.slug, offer]));
  const otherParcours = parcours.key === "a" ? PARCOURS_B : PARCOURS_A;
  const firstStepMilestones = milestones.map((amount) => ({
    amount,
    step: parcours.steps.find((step) => step.cumulativeAmount >= amount),
  }));
  const faq = faqFor(parcours);
  const headline =
    parcours.key === "a"
      ? "Parcours A : le parcours classique de 0 € à 1 017,50 € de primes"
      : "Parcours B : le parcours alternatif de 0 € à 1 052,01 € nets";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Gagner 1 000 €", item: `${SITE_URL}/gagner-1000-euros` },
          { "@type": "ListItem", position: 3, name: parcours.title, item: `${SITE_URL}${parcours.href}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PublicHeaderServer active="gains" />

      {/* 1. Titre et présentation rapide */}
      <section className={styles.detailIntro}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link><span aria-hidden="true">→</span>
            <Link href="/gagner-1000-euros">Gagner 1 000 €</Link><span aria-hidden="true">→</span>
            <strong>{parcours.shortTitle}</strong>
          </nav>
          <p className={styles.eyebrow}>{parcours.title}</p>
          <h1>{withWholeAmounts(headline)}</h1>
          <p>
            Le {parcours.shortTitle.toLowerCase()} part de 0 € et cumule progressivement les primes de bienvenue
            d’une série d’offres de parrainage : banques en ligne, courtiers et applications. Vous conservez vos
            primes pour financer le dépôt de l’étape suivante, au lieu de les dépenser.
          </p>
          <p>
            Chaque étape indique un dépôt, une prime, un délai et un gain cumulé. Les montants proviennent de
            l’infographie fournie ; les fiches Parrainio liées dans la liste ci-dessous donnent les conditions
            actuellement publiées pour chaque offre.
          </p>

          <div className={styles.quickStats} aria-label="Résumé du parcours">
            <div className={styles.quickStat}><span>{parcours.key === "b" ? "Total net illustré" : "Total des primes illustrées"}</span><strong>{parcours.total}</strong></div>
            <div className={styles.quickStat}><span>Après {parcours.key === "a" ? "7" : "8"} étapes</span><strong>{parcours.earlyTotal} en {parcours.earlyDelay}</strong></div>
            <div className={styles.quickStat}><span>Délai total indicatif</span><strong>{parcours.totalDelay}</strong></div>
          </div>
          <p className={styles.anchorRow}>
            <a className={styles.anchorButton} href={`#${parcours.key}-offres`}>Voir les offres du parcours ↓</a>
          </p>
        </div>
      </section>

      {/* 2. Image originale du parcours */}
      <section className={styles.detailHero}>
        <div className={styles.container}>
          <figure className={styles.detailImage}>
            <Image
              src={parcours.image}
              alt={parcours.imageAlt}
              fill
              sizes="(max-width: 850px) 100vw, 820px"
              unoptimized
              loading="eager"
            />
          </figure>
        </div>
      </section>

      {/* 3. Offres cliquables, immédiatement sous l’image */}
      <section className={styles.offersSection} aria-labelledby={`${parcours.key}-offres`}>
        <div className={styles.container}>
          <h2 id={`${parcours.key}-offres`} className={styles.sectionHeading}>Les offres de ce parcours</h2>
          <p className={styles.sectionLead}>
            Cliquez sur une offre pour ouvrir sa fiche Parrainio et vérifier les conditions en vigueur avant de
            commencer. Les étapes sans fiche référencée sont signalées : aucun lien n’est inventé.
          </p>
          <div className={styles.offerGrid}>
            {parcours.steps.map((step) => {
              const offer = step.offerSlug ? offerBySlug.get(step.offerSlug) : undefined;
              const content = (
                <>
                  <span className={styles.offerRank}>{step.number}</span>
                  <span className={styles.offerCardBody}>
                    <strong>{step.name}{step.subtitle ? ` · ${step.subtitle}` : ""}</strong>
                    <small>Prime {step.reward} · dépôt {step.deposit} · {step.delay}</small>
                  </span>
                  <span className={styles.offerCardCta}>{offer ? "Voir l’offre →" : "Non référencée"}</span>
                </>
              );
              return offer ? (
                <Link className={styles.offerCard} href={`/offres/${offer.slug}`} prefetch={false} key={step.number}>
                  {content}
                </Link>
              ) : (
                <div className={`${styles.offerCard} ${styles.offerCardDisabled}`} key={step.number}>{content}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Explications détaillées */}
      <section className={styles.howSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading}>Comment fonctionne le parcours ?</h2>
          <p className={styles.sectionLead}>Le tableau présente les montants et délais inscrits dans l’infographie. Le cumul additionne les primes du scénario ; il ne signifie pas que tous les fonds sont immédiatement disponibles pour un nouveau dépôt.</p>
          <div className={styles.howGrid}>
            <article className={styles.howCard}>
              <h3>Réutiliser ses primes</h3>
              <p>Le principe est de conserver les primes reçues et de mobiliser une partie du capital disponible pour le dépôt suivant. Les gains ne doivent être engagés qu’après lecture des conditions de retrait, de conservation et de validation de l’offre concernée.</p>
            </article>
            <article className={styles.howCard}>
              <h3>L’ordre des inscriptions</h3>
              <p>Commencez par les offres sans dépôt, puis enchaînez avec celles qui demandent une somme modérée. Les étapes à dépôt plus élevé arrivent une fois les premières primes reçues : c’est ce qui permet d’avancer sans avancer d’argent personnel important.</p>
            </article>
            <article className={styles.howCard}>
              <h3>Les montants de chaque annonce</h3>
              <p>Pour chaque application, le détail ci-dessous distingue le scénario illustré des montants partenaire et Parrainio actuellement affichés sur l’annonce, lorsqu’ils sont renseignés. La fiche liée reste la référence pour les conditions en vigueur.</p>
            </article>
            <article className={styles.howCard}>
              <h3>Les délais et la disponibilité des fonds</h3>
              <p>Les délais sont indicatifs et cumulés : une prime validée n’est pas forcément retirable immédiatement. Tenez compte des périodes de conservation demandées par les banques et les courtiers avant de réutiliser un gain.</p>
            </article>
          </div>
          <ul className={styles.disclaimerList}>
            <li>Les primes affichées dans les tableaux comprennent les reversements Parrainio.fr lorsqu’ils sont indiqués dans le scénario.</li>
            <li>Les dépôts ne sont pas nécessairement des dépenses définitives, mais leur retrait et leur disponibilité dépendent des conditions de chaque partenaire.</li>
            <li>Les délais sont indicatifs et peuvent varier selon la validation du dossier, les opérations demandées et les délais de traitement.</li>
            <li>Chaque offre a ses propres conditions d’éligibilité et de validation. Un dépôt ou un gain peut rester bloqué ; les investissements et actifs numériques comportent un risque de perte.</li>
          </ul>
          <p className={styles.simulationNote}>
            Les montants de ce parcours sont indicatifs et peuvent évoluer avec les conditions des partenaires. Une
            marge de variation d’environ 3 à 4 % peut exister sur certaines opérations selon les frais appliqués.
          </p>
        </div>
      </section>

      <section className={styles.milestoneSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading}>Les paliers du parcours</h2>
          <p className={styles.sectionLead}>Repères de cumul dans le scénario, sans garantie que les primes soient déjà retirables.</p>
          <div className={styles.milestoneGrid}>
            {firstStepMilestones.map(({ amount, step }) => (
              <div className={styles.milestone} key={amount}>
                <strong>{amount} €</strong>
                <span>{step ? `Atteint à l’étape ${step.number} · ${step.name} · cumul ${step.cumulativeGain}` : "Palier non atteint dans ce scénario"}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.tableSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading}>Les étapes et les annonces Parrainio</h2>
          <p className={styles.sectionLead}>Faites défiler horizontalement le tableau sur téléphone. Les lignes avec une offre référencée ouvrent sa fiche Parrainio ; les autres restent identifiées comme des annonces non disponibles.</p>
          {parcours.key === "b" ? <p className={styles.tableNote}>Le montant net de Revolut (32,01 €) est utilisé pour recalculer chaque cumul. La ligne « après 8 étapes » est donc à 432,01 €, et non 440,01 € comme sur le visuel. L’addition des primes nettes listées conduit à 1 052,01 € au total.</p> : null}
          <div className={styles.tableScroller} tabIndex={0} aria-label="Tableau des étapes du parcours, défilement horizontal possible">
            <table className={styles.journeyTable}>
              <caption>{parcours.key === "b" ? `${parcours.title} — montants de l’infographie, avec le net Revolut recalculé` : `${parcours.title} — montants et délais de l’infographie`}</caption>
              <thead>
                <tr>
                  <th scope="col">Étape</th>
                  <th scope="col">Application</th>
                  <th scope="col">Dépôt nécessaire</th>
                  <th scope="col">Prime reçue<br />(reversement inclus si indiqué)</th>
                  <th scope="col">Délai indicatif</th>
                  <th scope="col">Délai cumulé</th>
                  <th scope="col">Gain cumulé</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {parcours.steps.map((step, index) => {
                  const crossedMilestone = milestones.some((milestone) =>
                    step.cumulativeAmount >= milestone && (index === 0 || parcours.steps[index - 1].cumulativeAmount < milestone)
                  );
                  return (
                    <tr className={crossedMilestone || index === parcours.steps.length - 1 ? styles.milestoneRow : ""} id={`etape-${step.number}`} key={step.number}>
                      <td><span className={styles.stepNumber}>{step.number}</span></td>
                      <td><span className={styles.appName}>{step.name}</span>{step.subtitle ? <span className={styles.subline}>{step.subtitle}</span> : null}</td>
                      <td>{step.deposit}</td>
                      <td><strong>{step.reward}</strong>{step.rewardBreakdown ? <span className={styles.subline}>{step.rewardBreakdown}</span> : null}</td>
                      <td>{step.delay}</td>
                      <td>{step.cumulativeDelay}</td>
                      <td><span className={`${styles.gainPill} ${index === parcours.steps.length - 1 ? styles.finalGain : ""}`}>{step.cumulativeGain}</span></td>
                      <td>
                        {step.offerSlug ? (
                          <Link className={styles.offerAction} href={`/offres/${step.offerSlug}`} prefetch={false}>Accéder à l’offre</Link>
                        ) : (
                          <span className={styles.noOffer}>Annonce non référencée</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className={styles.simulationNote}>
            <strong>Montants estimés :</strong> les primes et les cumuls de ce tableau sont des estimations issues du
            scénario. Une marge de variation d’environ 3 à 4 % peut exister sur certaines opérations, selon les frais
            des applications, les frais de transaction, le prix d’achat des actions ou actifs, les frais de retrait et
            les conditions commerciales des partenaires.
          </p>
        </div>
      </section>

      <section className={styles.stepsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading}>Explication étape par étape</h2>
          <p className={styles.sectionLead}>Les dépôts, primes et délais ci-dessous décrivent le scénario de l’infographie. Les détails intitulés « annonce Parrainio publiée » viennent de la fiche du partenaire et peuvent donc différer du scénario.</p>
          <div className={styles.stepsGrid}>
            {parcours.steps.map((step, index) => {
              const offer = step.offerSlug ? offerBySlug.get(step.offerSlug) : undefined;
              const previous = parcours.steps[index - 1];
              const next = parcours.steps[index + 1];
              return (
                <article className={styles.stepCard} id={`detail-etape-${step.number}`} key={step.number}>
                  <div className={styles.stepCardTop}>
                    <h3><span>Étape {step.number}</span>{step.name}{step.subtitle ? ` — ${step.subtitle}` : ""}</h3>
                    <span className={styles.stepReward}>{step.reward}</span>
                  </div>
                  <p><strong>Pourquoi à cette étape ?</strong> {previous ? `Après ${previous.name}, le cumul illustré est de ${previous.cumulativeGain}. Cette ligne ajoute ${step.netReward ?? step.reward} au cumul du scénario et le porte à ${step.cumulativeGain}.` : `Le scénario commence par ${step.name} : l’infographie indique un dépôt de ${step.deposit} et une prime de ${step.reward}${step.netReward ? `, soit ${step.netReward} après frais` : ""}.`}</p>
                  <div className={styles.stepFacts}>
                    <div className={styles.stepFact}><span>Dépôt du scénario</span><strong>{step.deposit}</strong></div>
                    <div className={styles.stepFact}><span>Prime du scénario</span><strong>{step.reward}{step.rewardBreakdown ? ` · ${step.rewardBreakdown}` : ""}</strong></div>
                    <div className={styles.stepFact}><span>Délai indicatif</span><strong>{step.delay}</strong></div>
                    <div className={styles.stepFact}><span>Cumul affiché</span><strong>{step.cumulativeGain} · {step.cumulativeDelay}</strong></div>
                  </div>
                  <p>{next ? `Pour l’étape suivante (${next.name}), le scénario indique un dépôt de ${next.deposit}. Le cumul affiché ici est ${step.cumulativeGain} ; seule la part réellement disponible et conforme aux conditions du partenaire peut être réutilisée.` : "C’est la dernière étape de cette infographie ; le cumul final reste soumis à l’éligibilité et à la validation de chaque offre."}</p>

                  <div className={styles.publishedOffer}>
                    <h4>Annonce Parrainio publiée</h4>
                    {offer ? (
                      <>
                        <p><strong>Partenaire :</strong> {offer.partnerReward || "Montant non renseigné sur la fiche."}</p>
                        <p><strong>Reversement Parrainio :</strong> {offer.parrainioReward ?? "Aucun reversement indiqué sur cette fiche."}</p>
                        {offer.conditions.length ? (
                          <ul className={styles.conditionsList}>
                            {offer.conditions.map((condition, conditionIndex) => <li key={`${step.offerSlug}-${conditionIndex}`}>{condition}</li>)}
                          </ul>
                        ) : <p>La fiche ne détaille pas de condition supplémentaire.</p>}
                        <Link href={`/offres/${offer.slug}`} prefetch={false}>Voir l’annonce {offer.name} →</Link>
                      </>
                    ) : (
                      <div className={styles.missingOffer}>
                        Aucune annonce Parrainio correspondant exactement à « {step.name} » n’est référencée. Le lien n’est pas affiché afin de ne pas créer une URL supposée.
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Conseils pour optimiser les gains et précautions */}
      <section className={styles.adviceSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading}>Conseils pour optimiser les gains</h2>
          <p className={styles.sectionLead}>Le parcours fonctionne d’autant mieux que les inscriptions sont préparées : mêmes informations personnelles, justificatifs disponibles et conditions lues à l’avance.</p>
          <div className={styles.adviceGrid}>
            <article className={styles.adviceCard}>
              <h3>Gardez une trace de chaque parrainage</h3>
              <p>Notez la date d’inscription, le dépôt réalisé, le montant annoncé et le délai de versement. En cas de retard, vous saurez quelle offre relancer et sur quelles conditions vous appuyer.</p>
            </article>
            <article className={styles.adviceCard}>
              <h3>Respectez les conditions de dépôt</h3>
              <p>Un dépôt trop faible ou retiré trop tôt peut annuler la prime. Vérifiez le montant minimal, la durée de conservation et les opérations demandées sur la fiche de l’offre avant de poursuivre.</p>
            </article>
            <article className={styles.adviceCard}>
              <h3>Ne réutilisez que les fonds disponibles</h3>
              <p>Le cumul affiché n’est pas un solde bancaire. Attendez que la prime soit effectivement créditée et retirable avant de financer l’étape suivante, pour éviter d’avancer vos propres liquidités.</p>
            </article>
            <article className={styles.adviceCard}>
              <h3>Adaptez le parcours à votre situation</h3>
              <p>Si vous êtes déjà client d’une banque ou avez déjà utilisé une application, remplacez l’étape par une offre équivalente du catalogue Parrainio. L’ordre reste indicatif, l’objectif est de continuer à cumuler.</p>
            </article>
          </div>

          {parcours.key === "b" ? (
            <aside className={styles.caution}>
              <strong>Correction du cumul net du parcours B :</strong> le visuel affiche 440,01 € après huit étapes tout en indiquant 32,01 € de gain net pour Revolut (40 € moins 7,99 € de frais). En appliquant ce net à chaque cumul, le total après huit étapes est 432,01 €. Le tableau conserve les autres montants du scénario et aboutit à 1 052,01 € au terme des douze étapes. Le visuel fourni reste inchangé.
            </aside>
          ) : null}

          <aside className={styles.caution}>
            <strong>À vérifier avant chaque inscription :</strong> les tableaux reprennent les scénarios des infographies, mais les fiches actuellement publiées sur Parrainio peuvent afficher des montants ou conditions différents. C’est notamment le cas de certaines offres comme BNP Paribas, Hello bank!, N26 et Kraken. Les fiches liées dans le tableau exposent les informations publiées pour chaque offre ; elles doivent être relues avant tout dépôt. Le total affiché dans le scénario n’est pas une somme garantie par les offres en vigueur.
          </aside>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className={styles.faqSection} aria-labelledby={`${parcours.key}-faq`}>
        <div className={styles.container}>
          <h2 id={`${parcours.key}-faq`} className={styles.sectionHeading}>Questions fréquentes sur le {parcours.shortTitle.toLowerCase()}</h2>
          <div className={styles.faqList}>
            {faq.map((item) => (
              <details className={styles.faqItem} key={item.question}>
                <summary><h3>{item.question}</h3></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
          <p className={styles.faqLinks}>
            Pour aller plus loin : <Link href="/gagner-1000-euros">les deux parcours pour gagner 1 000 €</Link>,{" "}
            <Link href="/categories/banque-finance">les offres de parrainage bancaire</Link> et{" "}
            <Link href="/observatoire-conditions-prime">l’observatoire des conditions de prime</Link>.
          </p>
        </div>
      </section>

      <section className={styles.conclusion}>
        <div className={`${styles.container} ${styles.conclusionCard}`}>
          <div>
            <h2>Vous possédez déjà certaines de ces applications ? Pas de problème !</h2>
            <p>Vous pouvez adapter votre parcours en remplaçant les offres déjà utilisées par d’autres opportunités disponibles sur Parrainio.fr.</p>
            <p>L’objectif n’est pas de suivre obligatoirement toutes les étapes dans un ordre précis, mais de conserver vos primes et de les utiliser intelligemment pour débloquer de nouvelles offres.</p>
          </div>
          <div className={styles.conclusionActions}>
            <Link className={styles.primaryButton} href={otherParcours.href}>Découvrir l’autre parcours</Link>
            <Link className={styles.secondaryButton} href="/gagner-1000-euros">Voir les deux parcours</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
