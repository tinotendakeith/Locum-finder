import Link from "next/link";
import { dashboardPathForRole, getCurrentUser } from "../lib/local-auth";

export function Logo({ className = "brand-image" }: { className?: string }) {
  return <img src="/locumfinder-logo.webp" alt="Locum Finder Zimbabwe" className={className} />;
}

export async function PublicHeader() {
  const user = await getCurrentUser();

  return (
    <header className="public-header">
      <div className="utility-bar">
        <div className="container utility-inner">
          <div className="socials" aria-label="Social links">
            <span>f</span>
            <span>t</span>
            <span>ig</span>
            <span>in</span>
          </div>
          <div>58A George Silundika Avenue</div>
          <div className="auth-links">
            {user ? (
              <Link href={dashboardPathForRole(user.role)}>Dashboard</Link>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container main-nav">
        <Link href="/" className="brand" aria-label="Locum Finder home">
          <Logo />
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/dashboard/clinic">Job Dashboard</Link>
          <Link href="/register/clinic">Post a Job</Link>
          <Link href="/jobs">Jobs</Link>
          <Link href="/dashboard/locum">Candidate Dashboard</Link>
        </nav>
        <div className="nav-actions">
          <span className="person-icon" aria-hidden="true">o</span>
          <Link href="/jobs" className="btn">Find a Locum</Link>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" aria-label="Locum Finder home">
            <Logo />
          </Link>
          <p className="muted">Connect clinics and hospitals with verified locum medical professionals across Zimbabwe.</p>
        </div>
        <div>
          <h3>Platform</h3>
          <ul>
            <li><Link href="/jobs">Browse jobs</Link></li>
            <li><Link href="/register/locum">Create locum account</Link></li>
            <li><Link href="/register/clinic">Post a vacancy</Link></li>
          </ul>
        </div>
        <div>
          <h3>Company</h3>
          <ul>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/privacy/data-rights">Data rights</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
