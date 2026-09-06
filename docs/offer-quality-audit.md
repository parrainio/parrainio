# Offer Quality Audit

Audit of the 120 offer pages (`/offres/[slug]`) — analysis only (no source file modified, no commit).
Source of truth: `data/offers.ts` + `data/offer-overrides.json` (the card fields actually served) + the 14 `OfferSeoProfile` maps merged exactly as `app/offres/[slug]/page.tsx` merges them (lot15 → lot02 → offer-seo).

**Method.** Every profile was extracted at runtime (tsc transpile → require), then measured per offer: word counts per section, verbatim sentence duplication across the 120 pages, 4-gram Jaccard similarity of card descriptions and referral explanations, FAQ question-pattern frequency, title/meta lengths and duplication, and structural presence of earnings / reward-timing / audience / FAQ sections. Scores were then calibrated by reading the actual text of every candidate page — word counts alone flagged 102/120, which would have been meaningless.

## Summary

- **Total offers audited: 120** (all 120 have an SEO profile; 0 missing)
- **A (strong / no action): 82 (68%)**
- **B (minor editorial improvement): 22 (18%)**
- **C (clear improvement recommended): 16 (13%)**
- **D (priority, substantial improvement): 0**

Most common weaknesses (in order of frequency):

1. **Batch9 boilerplate in "why choose"** — 11 profiles (bemyeye, i-run-fr, bitpanda, bebe-boutik, bybit, fdj-francaise-des-jeux, lalalab, sumeria, meilleurtaux-com, assurancevie-com, edf) share two verbatim disclaimer sentences (~40 words) that dominate their whyChoose paragraphs, and most also open that section on a raw label fragment ("Filleul : 40 € TTC sur facture.", "Statut : parrainage terminé.", "Accès : Moi > Parrainage.").
2. **Template card descriptions** — 48/120 descriptions follow one of 4 formulas ("X est un site de vente…", "…une plateforme de…", "…un service dans le domaine Y", "…une application de…"); 4 pairs are near-identical between sibling brands (worst: Myprotein/Zumub at 83% 4-gram overlap, near-verbatim).
3. **Audience sentence duplicated on the page** — 33 profiles embed their `audience` string verbatim inside a whyChoose paragraph, so the template renders the same sentence twice on one page.
4. **Short referral explanations on small-brand profiles** — ~20 pages explain the mechanism in ≤25 words, e.g. 10-pourcent-1 (20 w), c-monetiquette (20 w), epargnoo-5 (20 w), lalalab (21 w).
5. **One structural gap** — airbnb (voyageur) is the only page missing the "Combien peut-on gagner ?" and "Quand reçoit-on la récompense ?" sections.

Systematic issues: **yes, two generation-era patterns**. Everything produced by the batch9 pass shows the same boilerplate + label-opener construction (fix once → 11 pages), and card descriptions were written from a handful of formulas (fix per brand → ~48 pages). Outside those two patterns the corpus is healthy: 0 duplicated titles, 0 duplicated meta descriptions, FAQ questions almost fully unique (the most shared question appears on only 3 pages), and no near-duplicate referral explanations at all (0 pairs above 35% overlap).

## Priority C/D pages

| Priority | Offer | Slug | Main issue | Recommended action |
|---|---|---|---|---|
| C | BeMyEye | bemyeye | whyChoose is mostly the two shared batch9 disclaimer sentences | Rewrite the whyChoose paragraphs with brand-specific content (replace the shared disclaimers/label fragments); for the small-corpus pages also expand referral explanation + card description |
| C | i-Run | i-run-fr | whyChoose dominated by the shared batch9 boilerplate | Rewrite the whyChoose paragraphs with brand-specific content (replace the shared disclaimers/label fragments); for the small-corpus pages also expand referral explanation + card description |
| C | Bitpanda | bitpanda | shared batch9 boilerplate + whyChoose opens on a label fragment ("Maximum : 100 € chacun.") | Rewrite the whyChoose paragraphs with brand-specific content (replace the shared disclaimers/label fragments); for the small-corpus pages also expand referral explanation + card description |
| C | Bébé Boutik | bebe-boutik | batch9 boilerplate + 9-word generic card description | Rewrite the whyChoose paragraphs with brand-specific content (replace the shared disclaimers/label fragments); for the small-corpus pages also expand referral explanation + card description |
| C | Bybit | bybit | batch9 boilerplate + label-opener ("Récompense : variable selon campagne"), no concrete amounts | Rewrite the whyChoose paragraphs with brand-specific content (replace the shared disclaimers/label fragments); for the small-corpus pages also expand referral explanation + card description |
| C | FDJ | fdj-francaise-des-jeux | batch9 boilerplate + label-opener ("Statut : parrainage terminé") on a closed program | Rewrite the whyChoose paragraphs with brand-specific content (replace the shared disclaimers/label fragments); for the small-corpus pages also expand referral explanation + card description |
| C | Lalalab | lalalab | batch9 boilerplate + label-opener + 21-word referral explanation | Rewrite the whyChoose paragraphs with brand-specific content (replace the shared disclaimers/label fragments); for the small-corpus pages also expand referral explanation + card description |
| C | Sumeria | sumeria | batch9 boilerplate + label-opener ("Accès : Moi > Parrainage.") | Rewrite the whyChoose paragraphs with brand-specific content (replace the shared disclaimers/label fragments); for the small-corpus pages also expand referral explanation + card description |
| C | Meilleurtaux.com | meilleurtaux-com | batch9 boilerplate + label-opener ("Assurance de prêt : 100 € / 50 €.") over a multi-vertical service | Rewrite the whyChoose paragraphs with brand-specific content (replace the shared disclaimers/label fragments); for the small-corpus pages also expand referral explanation + card description |
| C | assurancevie.com | assurancevie-com | batch9 boilerplate + label-opener ("Parrain : 100 €.") | Rewrite the whyChoose paragraphs with brand-specific content (replace the shared disclaimers/label fragments); for the small-corpus pages also expand referral explanation + card description |
| C | EDF | edf | batch9 boilerplate + label-opener ("Filleul : 40 € TTC sur facture.") | Rewrite the whyChoose paragraphs with brand-specific content (replace the shared disclaimers/label fragments); for the small-corpus pages also expand referral explanation + card description |
| C | 10 pourcent | 10-pourcent-1 | 20-word referral explanation + generic description + thin whyChoose (34 w) | Rewrite the whyChoose paragraphs with brand-specific content (replace the shared disclaimers/label fragments); for the small-corpus pages also expand referral explanation + card description |
| C | C-MonEtiquette | c-monetiquette | thinnest corpus (415 w): 20-word referral, 28-word whyChoose, generic description | Rewrite the whyChoose paragraphs with brand-specific content (replace the shared disclaimers/label fragments); for the small-corpus pages also expand referral explanation + card description |
| C | Zumub | zumub | card description verbatim-identical to Myprotein + 25-word whyChoose | Rewrite the whyChoose paragraphs with brand-specific content (replace the shared disclaimers/label fragments); for the small-corpus pages also expand referral explanation + card description |
| C | Coinhouse | coinhouse | audience sentence duplicated verbatim inside whyChoose (rendered twice on the page) | Rewrite the whyChoose paragraphs with brand-specific content (replace the shared disclaimers/label fragments); for the small-corpus pages also expand referral explanation + card description |
| C | Biogents | biogents | thinnest corpus (412 w): 32-word whyChoose, 23-word referral, 8-word generic description | Rewrite the whyChoose paragraphs with brand-specific content (replace the shared disclaimers/label fragments); for the small-corpus pages also expand referral explanation + card description |

*No D page: nothing requires a substantial rebuild — every C page has solid conditions, FAQ and page structure; the gap is concentrated in the "why choose" copy and a few card descriptions.*

## B pages

| Priority | Offer | Slug | Main issue | Recommended action |
|---|---|---|---|---|
| B | Airbnb | airbnb | Only page without "Combien peut-on gagner ?" and "Quand reçoit-on la récompense ?" sections | Add earnings + reward-timing sections (no invention — factual verification first) |
| B | Bricks | bricks | Card description near-identical to La Première Brique (Jaccard 0.5) | Rewrite the card description with brand-specific wording |
| B | Choose | choose | Generic card description (8 words) | Rewrite the card description with brand-specific wording |
| B | Myprotein | myprotein | Card description near-identical to Zumub (Jaccard 0.83) | Rewrite the card description with brand-specific wording |
| B | La Première Brique | la-premiere-brique-1 | Card description near-identical to Bricks (Jaccard 0.5) | Rewrite the card description with brand-specific wording |
| B | Macadam | macadam-4 | Generic card description (9 words) | Rewrite the card description with brand-specific wording |
| B | Naomi | naomi-1 | Generic card description (9 words) | Rewrite the card description with brand-specific wording |
| B | Bienprêter | bienpreter | Generic card description (9 words) | Rewrite the card description with brand-specific wording |
| B | Greenweez | greenweez-6 | Card description near-identical to La Belle Vie (Jaccard 0.46) | Rewrite the card description with brand-specific wording |
| B | Swagbucks | swagbucks | Card description near-identical to Freecash (Jaccard 0.52) | Rewrite the card description with brand-specific wording |
| B | KAROS | karos | Generic card description (8 words) | Rewrite the card description with brand-specific wording |
| B | Freecash | freecash | Card description near-identical to Swagbucks (Jaccard 0.52) | Rewrite the card description with brand-specific wording |
| B | SumUp | sumup | Short whyChoose section (26 words) | Light editorial top-up (referral explanation / whyChoose) |
| B | La Belle Vie | la-belle-vie | Card description near-identical to Greenweez (Jaccard 0.46) | Rewrite the card description with brand-specific wording |
| B | Cointiply | cointiply | Generic card description (9 words) | Rewrite the card description with brand-specific wording |
| B | Betsson | betsson | Generic card description (7 words) | Rewrite the card description with brand-specific wording |
| B | Liberté Watts | liberte-watts | Short referral explanation (22 words) | Expand the referral explanation with steps already documented in the profile |
| B | Alltricks | alltricks | Short whyChoose section (28 words) | Light editorial top-up (referral explanation / whyChoose) |
| B | Epargnoo | epargnoo-5 | Short referral explanation (20 words) | Expand the referral explanation with steps already documented in the profile |
| B | Speedo | speedo | Short referral explanation (22 words) | Expand the referral explanation with steps already documented in the profile |
| B | Ludocortex | ludocortex | Short referral explanation (22 words) | Expand the referral explanation with steps already documented in the profile |
| B | Simplis | simplis | Short referral explanation (24 words) | Expand the referral explanation with steps already documented in the profile |

## Systematic patterns

1. **Batch9 disclaimer block (11 pages, one fix).** Two sentences appear verbatim on 11 pages: "La récompense doit être distinguée de la commission Parrainio…" and "Les montants, formes et délais présentés ici sont ceux du programme décrit…". They consume ~40 of the ~60 whyChoose words on each page. Replace per brand with specific content, keeping a single rephrased compliance line.
2. **Label-opener whyChoose (same 11 pages).** whyChoose paragraph 1 starts with a data-label fragment instead of prose ("Parrain : 100 €.", "Maximum : 100 € chacun.", "Récompense : variable selon campagne.", "Statut : parrainage terminé.", "Accès : Moi > Parrainage.", "Filleul : 40 € TTC sur facture.", "Filleul : 10 € de réduction.", "Filleul : 5 € de réduction observés.", "Assurance de prêt : 100 € / 50 €."). Convert to prose.
3. **Audience echo (33 pages).** `audience` renders as its own section AND is pasted verbatim (or near-verbatim) inside whyChoose. Rephrase one of the two.
4. **Card-description formulas (~48 pages).** Four templates cover 48 descriptions; rewrite per brand with one concrete differentiator (what it sells, for whom). Highest-priority pairs: Myprotein/Zumub (83%), Swagbucks/Freecash (52%), Bricks/La Première Brique (50%), Greenweez/La Belle Vie (46%).
5. **Campaign-dependent abstraction (acceptable, keep).** For bybit, weward, speedo, meilleurtaux-com… the referral explanation correctly avoids inventing amounts. Not a defect — it caps usefulness until a concrete campaign is documented.
6. **FAQ: healthy.** No repeated question pattern beyond 3× ("Le filleul doit-il être un nouvel utilisateur ?"); only 6 pages carry one answer under 12 words (ebuyclub, shopmium, showroomprive, betclic, thefork, aroma-zone) — minor.

## Factual verification needed

No information was invented in this audit; the following pages rely on data the repository itself marks as observed or closed, and would benefit from a factual re-check before any rewrite:

- **fdj-francaise-des-jeux** — profile states the referral operation is "terminé" (closed as of 2026-09-02). Verify whether a successor program exists before touching the page.
- **speedo** — profile documents no fixed referral prime ("Lorsqu'un code est proposé…"). Verify whether a permanent program exists; the page currently reads as promo-code guidance.
- **airbnb** (voyageur) — no reward amount or timing exists anywhere in the profile data. Verify current Airbnb referral terms; do not fill the missing sections from memory.
- **lalalab ("5 € de réduction observés"), 10-pourcent-1 ("0,50 €"), weward / bybit (montants selon campagne)** — amounts are campaign observations tied to a `researchedAt` date; re-verify before reuse in new copy.

## Strong pages

- **boursobank** — the reference page: 99-word referral explanation with precise, ordered qualification steps (300 € versement, card operations, EasyMove), earnings breakdown and reward timing; ~980 words total, all specific.
- **airbnb-1 (Airbnb Hôtes)** — complete host-program mechanics (180-day reservation window, payment 30 days after the stay, amounts by territory), earnings + timing sections present.
- **macadam-4** — 70-word referral explanation covering the subtle cases (48-hour code recovery, separate parrain/filleul validation).
- **naomi-1** — precise mechanics: 24-hour code window, bank-account uniqueness requirement, one-time code.
- **igraal** — richest corpus (730 editorial words) without padding; cashback mechanics (activation-before-purchase) explained end to end.

## Full audit

| # | Offer | Slug | Score | Main observation |
|---|---|---|---|---|
| 1 | 10 pourcent | 10-pourcent-1 | C | 20-word referral explanation + generic description + thin whyChoose (34 w) |
| 2 | Airbnb | airbnb | B | Only page without "Combien peut-on gagner ?" and "Quand reçoit-on la récompense ?" sections |
| 3 | Airbnb Hôtes | airbnb-1 | A | Strong, specific editorial corpus (598 editorial words) |
| 4 | Alltricks | alltricks | B | Short whyChoose section (28 words) |
| 5 | Aroma-Zone | aroma-zone | A | Strong, specific editorial corpus (551 editorial words) |
| 6 | assurancevie.com | assurancevie-com | C | batch9 boilerplate + label-opener ("Parrain : 100 €.") |
| 7 | AttaPoll | attapoll | A | Strong, specific editorial corpus (595 editorial words) |
| 8 | Bébé Boutik | bebe-boutik | C | batch9 boilerplate + 9-word generic card description |
| 9 | Becquet | becquet | A | Strong, specific editorial corpus (473 editorial words) |
| 10 | Beebs | beebs | A | Strong, specific editorial corpus (632 editorial words) |
| 11 | BeMyEye | bemyeye | C | whyChoose is mostly the two shared batch9 disclaimer sentences |
| 12 | Betclic | betclic | A | Strong, specific editorial corpus (595 editorial words) |
| 13 | Betsson | betsson | B | Generic card description (7 words) |
| 14 | Bienprêter | bienpreter | B | Generic card description (9 words) |
| 15 | Biogents | biogents | C | thinnest corpus (412 w): 32-word whyChoose, 23-word referral, 8-word generic description |
| 16 | Bitpanda | bitpanda | C | shared batch9 boilerplate + whyChoose opens on a label fragment ("Maximum : 100 € chacun.") |
| 17 | Bitstack | bitstack | A | Strong, specific editorial corpus (591 editorial words) |
| 18 | BoursoBank | boursobank | A | Strong, specific editorial corpus (909 editorial words) |
| 19 | Bricks | bricks | B | Card description near-identical to La Première Brique (Jaccard 0.5) |
| 20 | Bybit | bybit | C | batch9 boilerplate + label-opener ("Récompense : variable selon campagne"), no concrete amounts |
| 21 | C-MonEtiquette | c-monetiquette | C | thinnest corpus (415 w): 20-word referral, 28-word whyChoose, generic description |
| 22 | Caisse d'Épargne Loire-Centre | caisse-depargne-loire-centre | A | Strong, specific editorial corpus (475 editorial words) |
| 23 | Capital Koala | capital-koala | A | Strong, specific editorial corpus (579 editorial words) |
| 24 | Cartouche du toner | cartouche-du-toner | A | Solid page; slightly below-average corpus (469 words) but specific and complete |
| 25 | Choose | choose | B | Generic card description (8 words) |
| 26 | Coinbase | coinbase | A | Strong, specific editorial corpus (588 editorial words) |
| 27 | Coinhouse | coinhouse | C | audience sentence duplicated verbatim inside whyChoose (rendered twice on the page) |
| 28 | Cointiply | cointiply | B | Generic card description (9 words) |
| 29 | Coupon Network | coupon-network | A | Strong, specific editorial corpus (561 editorial words) |
| 30 | Crédit Agricole Centre Loire | credit-agricole-centre-loire | A | Strong, specific editorial corpus (624 editorial words) |
| 31 | Crypto.com | crypto-com | A | Strong, specific editorial corpus (565 editorial words) |
| 32 | Direct Assurance | direct-assurance | A | Strong, specific editorial corpus (615 editorial words) |
| 33 | eBuyClub | ebuyclub | A | Strong, specific editorial corpus (519 editorial words) |
| 34 | EDF | edf | C | batch9 boilerplate + label-opener ("Filleul : 40 € TTC sur facture.") |
| 35 | Engie | engie | A | Strong, specific editorial corpus (645 editorial words) |
| 36 | Epargnoo | epargnoo-5 | B | Short referral explanation (20 words) |
| 37 | etoro | etoro | A | Strong, specific editorial corpus (679 editorial words) |
| 38 | FDJ | fdj-francaise-des-jeux | C | batch9 boilerplate + label-opener ("Statut : parrainage terminé") on a closed program |
| 39 | FeaturePoints | featurepoints | A | Solid page; slightly below-average corpus (457 words) but specific and complete |
| 40 | FidMe | fidme | A | Solid page; slightly below-average corpus (428 words) but specific and complete |
| 41 | Fiverr | fiverr | A | Solid page; slightly below-average corpus (461 words) but specific and complete |
| 42 | Fizzer | fizzer | A | Strong, specific editorial corpus (614 editorial words) |
| 43 | Fortuneo | fortuneo | A | Strong, specific editorial corpus (744 editorial words) |
| 44 | Freecash | freecash | B | Card description near-identical to Swagbucks (Jaccard 0.52) |
| 45 | GMF | gmf | A | Strong, specific editorial corpus (576 editorial words) |
| 46 | Greenweez | greenweez-6 | B | Card description near-identical to La Belle Vie (Jaccard 0.46) |
| 47 | Hello Bank | hello-bank | A | Strong, specific editorial corpus (542 editorial words) |
| 48 | Hello Watt | hello-watt | A | Strong, specific editorial corpus (673 editorial words) |
| 49 | HelloFresh | hello-fresh | A | Strong, specific editorial corpus (559 editorial words) |
| 50 | HoneyGain | honeygain | A | Strong, specific editorial corpus (648 editorial words) |
| 51 | Hostinger | hostinger | A | Strong, specific editorial corpus (547 editorial words) |
| 52 | i-Run | i-run-fr | C | whyChoose dominated by the shared batch9 boilerplate |
| 53 | iGraal | igraal | A | Strong, specific editorial corpus (730 editorial words) |
| 54 | Instant Gaming | instant-gaming | A | Strong, specific editorial corpus (672 editorial words) |
| 55 | Joybuy | joybuy | A | Strong, specific editorial corpus (492 editorial words) |
| 56 | KAROS | karos | B | Generic card description (8 words) |
| 57 | Klarna | klarna | A | Strong, specific editorial corpus (477 editorial words) |
| 58 | Kraken | kraken | A | Strong, specific editorial corpus (591 editorial words) |
| 59 | L'Olivier Assurance | lolivier | A | Strong, specific editorial corpus (594 editorial words) |
| 60 | La Belle Vie | la-belle-vie | B | Card description near-identical to Greenweez (Jaccard 0.46) |
| 61 | La Bourse aux Livres | la-bourse-aux-livres | A | Short referral explanation (24 words) |
| 62 | La Première Brique | la-premiere-brique-1 | B | Card description near-identical to Bricks (Jaccard 0.5) |
| 63 | Lalalab | lalalab | C | batch9 boilerplate + label-opener + 21-word referral explanation |
| 64 | Liberté Watts | liberte-watts | B | Short referral explanation (22 words) |
| 65 | Linxea | linxea | A | Strong, specific editorial corpus (619 editorial words) |
| 66 | Ludocortex | ludocortex | B | Short referral explanation (22 words) |
| 67 | Macadam | macadam-4 | B | Generic card description (9 words) |
| 68 | Meilleurtaux.com | meilleurtaux-com | C | batch9 boilerplate + label-opener ("Assurance de prêt : 100 € / 50 €.") over a multi-vertical service |
| 69 | Monabanq | monabanq | A | Strong, specific editorial corpus (617 editorial words) |
| 70 | Myprotein | myprotein | B | Card description near-identical to Zumub (Jaccard 0.83) |
| 71 | Myvitamins | myvitamins | A | Strong, specific editorial corpus (485 editorial words) |
| 72 | N26 | n26 | A | Strong, specific editorial corpus (581 editorial words) |
| 73 | Naomi | naomi-1 | B | Generic card description (9 words) |
| 74 | Nutripure | nutripure | A | Strong, specific editorial corpus (474 editorial words) |
| 75 | OKX | okx | A | Solid page; slightly below-average corpus (463 words) but specific and complete |
| 76 | Parions Sport | parions-sport | A | Strong, specific editorial corpus (689 editorial words) |
| 77 | PayPal | paypal | A | Strong, specific editorial corpus (675 editorial words) |
| 78 | Phenix | phenix | A | Strong, specific editorial corpus (577 editorial words) |
| 79 | PlacesDesCartes | placesdescartes | A | Strong, specific editorial corpus (495 editorial words) |
| 80 | PMU | pmu | A | Strong, specific editorial corpus (567 editorial words) |
| 81 | Poulpeo | poulpeo | A | Strong, specific editorial corpus (660 editorial words) |
| 82 | Pourdebon | pourdebon | A | Short referral explanation (21 words) |
| 83 | Primeo Energie | primeo-energie | A | Strong, specific editorial corpus (558 editorial words) |
| 84 | Private Sport Shop | private-sport-shop | A | Strong, specific editorial corpus (623 editorial words) |
| 85 | Raizers | raizers | A | Strong, specific editorial corpus (490 editorial words) |
| 86 | Rakuten | rakuten-priceminister | A | Strong, specific editorial corpus (497 editorial words) |
| 87 | RED by SFR | sfr | A | Strong, specific editorial corpus (685 editorial words) |
| 88 | Reevolt | reevolt | A | Solid page; slightly below-average corpus (459 words) but specific and complete |
| 89 | Revolut | revolut | A | Strong, specific editorial corpus (511 editorial words) |
| 90 | Revolut Business | revolut-business | A | Solid page; slightly below-average corpus (452 words) but specific and complete |
| 91 | Ritmic | ritmic | A | Solid page; slightly below-average corpus (439 words) but specific and complete |
| 92 | Rover | rover-1 | A | Strong, specific editorial corpus (560 editorial words) |
| 93 | Scrambly | scrambly | A | Strong, specific editorial corpus (511 editorial words) |
| 94 | Shein | shein | A | Strong, specific editorial corpus (655 editorial words) |
| 95 | Shoes.fr | shoes-fr | A | Solid page; slightly below-average corpus (452 words) but specific and complete |
| 96 | Shopmium | shopmium | A | Strong, specific editorial corpus (471 editorial words) |
| 97 | Showroomprivé | showroomprive | A | Strong, specific editorial corpus (472 editorial words) |
| 98 | Simplis | simplis | B | Short referral explanation (24 words) |
| 99 | Speedo | speedo | B | Short referral explanation (22 words) |
| 100 | Splint Invest | splint-invest | A | Strong, specific editorial corpus (505 editorial words) |
| 101 | Sumeria | sumeria | C | batch9 boilerplate + label-opener ("Accès : Moi > Parrainage.") |
| 102 | SumUp | sumup | B | Short whyChoose section (26 words) |
| 103 | Swagbucks | swagbucks | B | Card description near-identical to Freecash (Jaccard 0.52) |
| 104 | SwissBorg | swissborg | A | Strong, specific editorial corpus (569 editorial words) |
| 105 | Systeme.io | systeme-io | A | Strong, specific editorial corpus (471 editorial words) |
| 106 | The Protein Works | the-protein-works | A | Short referral explanation (23 words) |
| 107 | TheFork | thefork | A | Strong, specific editorial corpus (564 editorial words) |
| 108 | Too Good To Go | too-good-to-go | A | Strong, specific editorial corpus (497 editorial words) |
| 109 | TopCashback | topcashback | A | Strong, specific editorial corpus (555 editorial words) |
| 110 | TotalEnergies | totalenergies | A | Strong, specific editorial corpus (735 editorial words) |
| 111 | Trade Republic | trade-republic | A | Strong, specific editorial corpus (496 editorial words) |
| 112 | Unibet | unibet | A | Strong, specific editorial corpus (633 editorial words) |
| 113 | Wanteeed | wanteeed | A | Strong, specific editorial corpus (578 editorial words) |
| 114 | WeWard | weward | A | Solid page; slightly below-average corpus (461 words) but specific and complete |
| 115 | Whatnot | whatnot | A | Strong, specific editorial corpus (474 editorial words) |
| 116 | Widilo | widilo | A | Strong, specific editorial corpus (550 editorial words) |
| 117 | Winamax | winamax | A | Strong, specific editorial corpus (510 editorial words) |
| 118 | Wise | wise | A | Strong, specific editorial corpus (598 editorial words) |
| 119 | ZeConfiserie | zeconfiserie | A | Solid page; slightly below-average corpus (467 words) but specific and complete |
| 120 | Zumub | zumub | C | card description verbatim-identical to Myprotein + 25-word whyChoose |
