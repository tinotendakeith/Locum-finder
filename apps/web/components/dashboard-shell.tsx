import Link from "next/link";
import { Logo } from "./public-layout";

type ShellProps = {
  title: string;
  menu: Array<{ href: string; label: string }>;
  currentPath?: string;
  accountName?: string;
  accountEmail?: string;
  children: React.ReactNode;
};

export function DashboardShell({ title, menu, currentPath = "", accountName, accountEmail, children }: ShellProps) {
  const isLocum = title.toLowerCase().includes("locum");
  const isAdmin = title.toLowerCase().includes("admin");
  const copy = isLocum
    ? "Manage your profile, resumes, saved jobs, applications, and clinic messages."
    : isAdmin
      ? "Moderate users, approvals, jobs, documents, applications, and platform operations."
      : "Manage facility profile, vacancies, applicants, hiring decisions, and notifications.";

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <Link href="/" className="sidebar-brand" aria-label="Locum Finder home">
          <Logo />
        </Link>
        <h2 className="sidebar-title">{title}</h2>
        <p className="sidebar-copy">{copy}</p>
        <nav className="sidebar-nav">
          {menu.map((item) => (
            <Link key={item.href} href={item.href} className={`sidebar-link${currentPath === item.href ? " active" : ""}`}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div>
            <span className="eyebrow">{isLocum ? "Candidate workspace" : isAdmin ? "Platform operations" : "Employer workspace"}</span>
            <h1>{title}</h1>
            {accountName ? <p className="muted">Signed in as <strong>{accountName}</strong>{accountEmail ? ` (${accountEmail})` : ""}</p> : null}
          </div>
          <div className="dashboard-actions">
            <Link href="/jobs" className="btn secondary">Browse jobs</Link>
            <form action="/auth/logout" method="post">
              <button type="submit" className="btn">Sign out</button>
            </form>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const tone =
    normalized.includes("approved") || normalized.includes("active") || normalized.includes("accepted") || normalized.includes("default")
      ? "success"
      : normalized.includes("pending") || normalized.includes("submitted") || normalized.includes("review") || normalized.includes("shortlisted")
        ? "warning"
        : normalized.includes("rejected") || normalized.includes("suspended") || normalized.includes("cancelled")
          ? "danger"
          : "neutral";

  return <span className={`badge ${tone}`}>{status}</span>;
}

export function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="metric-card">
      <p>{label}</p>
      <h3>{value}</h3>
    </article>
  );
}
