const bemoveCopyTrackingUrls: Record<string, string> = {
  sfr: "https://www.awin1.com/cread.php?awinmid=7310&awinaffid=274935&clickref=pao&ued=https%3A%2F%2Fwww.red-by-sfr.fr%2Ftelephones%2F",
  fortuneo: "https://tracking.publicidees.com/clic.php?promoid=272395&progid=1325&partid=37815&cb=pao",
  lolivier: "https://action.metaffiliation.com/trk.php?mclic=P5110055639012251&argsite=pao",
  engie: "https://xyd.particuliers.engie.fr/?P511AD156390124D1&argsite=pao",
  coinhouse: "https://www.financeads.net/tc.php?t=81972C386875220T&subid=pao",
};

export function getBemoveCopyTrackingUrl(slug: string): string | undefined {
  return bemoveCopyTrackingUrls[slug];
}
