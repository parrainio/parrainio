import { redirect } from "next/navigation";
import { getManagedOffers } from "@/data/managedOffers";
import { getFeaturedOffersAdmin } from "@/data/featuredOffersAdmin";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import FeaturedOffersManager from "./FeaturedOffersManager";
import CampaignSettings from "./CampaignSettings";
import { getBoostedCampaignConfig } from "@/data/boostedCampaign";

export default async function FeaturedOffersPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const allOffers = await getManagedOffers();
  const [featuredConfig, campaignConfig] = await Promise.all([getFeaturedOffersAdmin(), getBoostedCampaignConfig()]);

  return (
    <main className="admin-page">
      <div className="admin-header">
        <h1>Offres boostées</h1>
        <p>Campagne temporaire et offres mises en avant sur l’accueil</p>
      </div>
      <CampaignSettings config={campaignConfig} />
      <FeaturedOffersManager 
        allOffers={allOffers}
        featuredConfig={featuredConfig}
      />
    </main>
  );
}
