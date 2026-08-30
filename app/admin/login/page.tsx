import { adminAuthConfigured } from "@/lib/adminAuth";
import LoginForm from "./LoginForm";
import styles from "./login.module.css";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className={styles.page}>
      <LoginForm configured={adminAuthConfigured()} />
    </main>
  );
}
