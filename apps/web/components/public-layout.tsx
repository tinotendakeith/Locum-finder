import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="public-header">
      <div className="container top-row">
        <div className="brand">Locum Finder</div>
        <nav className="top-links">
          <Link href="/jobs">Browse Jobs</Link>
          <Link href="/register/locum">I am a Locum</Link>
          <Link href="/register/clinic">I am a Clinic</Link>
          <Link href="/login">Login</Link>
        </nav>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="container footer-grid">
        <div>
          <h3>Locum Finder</h3>
          <p>Healthcare staffing marketplace connecting facilities with verified locum professionals.</p>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
