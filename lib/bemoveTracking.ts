const bemoveCopyTrackingUrls: Record<string, string> = {
  sfr: "https://www.awin1.com/cread.php?awinmid=7310&awinaffid=274935&clickref=pao&ued=https%3A%2F%2Fwww.red-by-sfr.fr%2Ftelephones%2F",
  fortuneo: "https://tracking.publicidees.com/clic.php?promoid=272395&progid=1325&partid=37815&cb=pao",
  lolivier: "https://action.metaffiliation.com/trk.php?mclic=P5110055639012251&argsite=pao",
  engie: "https://xyd.particuliers.engie.fr/?P511AD156390124D1&argsite=pao",
  coinhouse: "https://www.financeads.net/tc.php?t=81972C386875220T&subid=pao",
  saily: "https://saily.sjv.io/rE0BAD?subId1=pao",
  ubigi: "https://go.ubigi.com/GbQNEV?subId1=pao",
  airalo: "https://airalo.pxf.io/zz0ONe?subId1=pao",
  esimo: "https://esimo.pxf.io/enQbMj?subId1=pao",
  holafly: "https://holafly.sjv.io/YVk6Lq?subId1=pao",
};

export function getBemoveCopyTrackingUrl(slug: string): string | undefined {
  return bemoveCopyTrackingUrls[slug];
}
