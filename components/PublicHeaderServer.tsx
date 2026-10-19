import { getActiveBoostedCampaign } from "@/data/boostedCampaign";
import PublicHeader, { type PublicHeaderProps } from "@/components/PublicHeader";

type PublicHeaderServerProps = Omit<PublicHeaderProps, "campaignActive">;

export default async function PublicHeaderServer(props: PublicHeaderServerProps) {
  const campaignActive = Boolean(await getActiveBoostedCampaign());
  return <PublicHeader {...props} campaignActive={campaignActive} />;
}
