import { redirect } from "next/navigation";
import { getManagedOffers } from "@/data/managedOffers";
import { getFeaturedOffersAdmin } from "@/data/featuredOffersAdmin";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import FeaturedOffersManager from "./FeaturedOffersManager";

export default async function FeaturedOffersPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const allOffers = getManagedOffers();
  const featuredConfig = getFeaturedOffersAdmin();

  return (
    <main className="admin-page">
      <div className="admin-header">
        <h1>Offres boostées</h1>
        <p>Gérez les 4 offres mises en avant sur l'accueil</p>
      </div>
      <FeaturedOffersManager 
        allOffers={allOffers}
        featuredConfig={featuredConfig}
      />
    </main>
  );
}
