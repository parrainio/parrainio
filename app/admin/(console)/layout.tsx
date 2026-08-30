import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAdmin } from "@/app/admin/actions";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div>
          <p>Parrainio</p>
          <strong>Administration des offres</strong>
        </div>
        <nav>
          <Link href="/admin/offres">Offres</Link>
          <Link href="/admin/featured">Offres boostées</Link>
          <Link href="/offres" target="_blank">
            Site public
          </Link>
          <form action={logoutAdmin}>
            <button type="submit">Déconnexion</button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  );
}
