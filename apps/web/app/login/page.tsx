import Link from "next/link";
import { redirect } from "next/navigation";
import { PublicFooter, PublicHeader } from "../../components/public-layout";
import { dashboardPathForRole, getCurrentUser } from "../../lib/local-auth";

function valueOf(input: string | string[] | undefined) {
  return Array.isArray(input) ? (input[0] ?? "") : (input ?? "");
}

function errorMessage(code: string) {
  if (code === "invalid_credentials") return "The email or password did not match an account.";
  if (code === "wrong_role") return "That account exists, but under a different account type.";
  return "";
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const returnTo = valueOf(params.returnTo);
  const role = valueOf(params.role) || "locum";
  const email = valueOf(params.email) || (role === "clinic" ? "clinic@locumfinder.test" : "locum@locumfinder.test");
  const error = errorMessage(valueOf(params.error));
  const loggedOut = valueOf(params.loggedOut) === "1";

  if (user && !returnTo) {
    redirect(dashboardPathForRole(user.role));
  }

  return (
    <>
      <PublicHeader />
      <main className="container section">
        <div className="page-head">
          <h1>Login</h1>
          <p>Use your saved account to continue into the locum or clinic workspace.</p>
        </div>
        <form className="card form-grid" action="/auth/login" method="post">
          <label>
            <span>Account type</span>
            <select className="select" name="role" defaultValue={role}>
              <option value="locum">Locum professional</option>
              <option value="clinic">Clinic / employer</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <label>
            <span>Email</span>
            <input className="input" name="email" defaultValue={email} placeholder="Email" required />
          </label>
          <label>
            <span>Password</span>
            <input className="input" type="password" name="password" defaultValue="demo-password" placeholder="Password" required />
          </label>
          <input type="hidden" name="returnTo" value={returnTo} />
          {returnTo ? <p className="helper-text">After login you will return to <strong>{returnTo}</strong>.</p> : null}
          {loggedOut ? <p className="feedback success-text">You have been signed out.</p> : null}
          {error ? <p className="feedback error-text">{error}</p> : null}
          <button className="btn" type="submit">Sign In</button>
        </form>

        <div className="quick-actions" style={{ marginTop: 16 }}>
          <form action="/auth/login" method="post">
            <input type="hidden" name="role" value="locum" />
            <input type="hidden" name="email" value="locum@locumfinder.test" />
            <input type="hidden" name="password" value="demo-password" />
            <input type="hidden" name="returnTo" value={returnTo} />
            <button type="submit" className="btn secondary">Demo locum</button>
          </form>
          <form action="/auth/login" method="post">
            <input type="hidden" name="role" value="clinic" />
            <input type="hidden" name="email" value="clinic@locumfinder.test" />
            <input type="hidden" name="password" value="demo-password" />
            <input type="hidden" name="returnTo" value={returnTo} />
            <button type="submit" className="btn secondary">Demo clinic</button>
          </form>
        </div>

        <div className="quick-actions" style={{ marginTop: 16 }}>
          <Link href={returnTo ? `/register/locum?returnTo=${encodeURIComponent(returnTo)}` : "/register/locum"} className="btn secondary">Create locum account</Link>
          <Link href="/register/clinic" className="btn secondary">Create clinic account</Link>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}