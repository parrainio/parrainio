import styles from "./BlogVisuals.module.css";

/**
 * Blocs visuels génériques du blog « Guides & astuces ».
 *
 * Composés en HTML/CSS pur (aucune image externe) : légers, cohérents
 * avec l'identité Parrainio et réutilisables par tous les articles via
 * les types de blocs correspondants du modèle (`data/blogArticles.ts`).
 *
 * Les liens internes restent dans les paragraphes : ces blocs sont des
 * supports pédagogiques et visuels, pas des zones de navigation.
 */

const SUBSCRIPTION_TILES = [
  { letter: "V", label: "Vidéo", tone: "a" },
  { letter: "T", label: "Télécom", tone: "b" },
  { letter: "L", label: "Logiciels", tone: "c" },
  { letter: "I", label: "Internet", tone: "d" },
  { letter: "S", label: "Sport", tone: "e" },
];

/** Illustration SVG d'article (assets originaux dans /public/images/blog). */
export function ArticleImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className={styles.imageFigure}>
      <img
        src={src}
        alt={alt}
        width={1200}
        height={675}
        loading="lazy"
        decoding="async"
      />
      {caption && <figcaption className={styles.imageCaption}>{caption}</figcaption>}
    </figure>
  );
}

/** Figure « les abonnements s'accumulent chaque mois » (composition pure). */
export function SubscriptionFigure() {
  return (
    <figure
      className={styles.figure}
      role="img"
      aria-label="Composition illustrant plusieurs abonnements récurrents — vidéo, télécom, logiciels, internet, sport — qui s'accumulent chaque mois."
    >
      <div className={styles.figurePanel}>
        <span className={styles.figureKicker}>Chaque mois</span>
        <div className={styles.tiles} aria-hidden="true">
          {SUBSCRIPTION_TILES.map((tile, index) => (
            <span className={styles.tile} key={tile.letter} data-index={index}>
              <span className={`${styles.tileIcon} ${styles[`tone${tile.tone}`]}`}>
                {tile.letter}
              </span>
              <span className={styles.tileLabel}>{tile.label}</span>
              <span className={styles.tileDot} />
            </span>
          ))}
        </div>
        <span className={styles.figureChip}>… et la somme s’additionne sans qu’on y pense.</span>
      </div>
      <figcaption className={styles.figcaption}>
        L’abonnement pris seul semble léger ; l’addition de plusieurs abonnements l’est moins.
      </figcaption>
    </figure>
  );
}

/** Infographie « méthode » : enchaînement d’étapes avec connecteurs. */
export function ProcessFlow({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className={styles.process} aria-label="Étapes de la méthode">
      {steps.map((step) => (
        <li className={styles.processStep} key={step.title}>
          <div className={styles.processNode}>
            <strong>{step.title}</strong>
            <span>{step.text}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Grille de cartes à icônes (identité visuelle de la méthode). */
export function IconCards({
  items,
}: {
  items: { icon: string; title: string; text: string }[];
}) {
  return (
    <ul className={styles.cards}>
      {items.map((item) => (
        <li className={styles.card} key={item.title}>
          <span className={styles.cardIcon} aria-hidden="true">
            {item.icon}
          </span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

/** Encadré pratique (ex. « À faire maintenant »). */
export function Callout({
  title,
  text,
  items,
}: {
  title: string;
  text?: string;
  items?: string[];
}) {
  return (
    <aside className={styles.callout}>
      <strong className={styles.calloutTitle}>{title}</strong>
      {text && <p>{text}</p>}
      {items && items.length > 0 && (
        <ul className={styles.calloutList}>
          {items.map((item) => (
            <li key={item.slice(0, 60)}>{item}</li>
          ))}
        </ul>
      )}
    </aside>
  );
}

/** Mini-checklist rendue visuellement (cases à cocher décoratives). */
export function ChecklistBox({ items }: { items: string[] }) {
  return (
    <ul className={styles.checklist}>
      {items.map((item) => (
        <li key={item.slice(0, 60)}>{item}</li>
      ))}
    </ul>
  );
}
