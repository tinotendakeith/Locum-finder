import Link from "next/link";

type ShellProps = {
  title: string;
  menu: Array<{ href: string; label: string }>;
  children: React.ReactNode;
};

export function DashboardShell({ title, menu, children }: ShellProps) {
  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">{title}</div>
        <nav>
          {menu.map((item) => (
            <Link key={item.href} href={item.href} className="sidebar-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="dashboard-main">{children}</main>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const tone =
    normalized.includes("approved") || normalized.includes("active") || normalized.includes("accepted")
      ? "success"
      : normalized.includes("pending") || normalized.includes("submitted") || normalized.includes("review")
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
