import Link from "next/link";
import { PublicFooter, PublicHeader } from "../../components/public-layout";

export default function LoginPage() {
  return (
    <>
      <PublicHeader />
      <main className="container section">
        <div className="page-head"><h1>Login</h1><p>Secure sign in for locums, clinics, and admins.</p></div>
        <form className="card form-grid">
          <input className="input" placeholder="Email" />
          <input className="input" type="password" placeholder="Password" />
          <button className="btn">Sign In</button>
          <Link href="/register" className="btn secondary">Create account</Link>
        </form>
      </main>
      <PublicFooter />
    </>
  );
}
