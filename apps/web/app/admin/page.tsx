import Link from "next/link";
import { DashboardShell, MetricCard, StatusBadge } from "../../components/dashboard-shell";
import { previewJobs } from "../../lib/preview-platform";
import { adminMenu } from "../../lib/ui";

export default function AdminDashboardPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu} currentPath="/admin">
      <div className="metric-row">
        <MetricCard label="Pending approvals" value={12} />
        <MetricCard label="Users" value={425} />
        <MetricCard label="Active jobs" value={previewJobs.length} />
        <MetricCard label="Applications" value={1204} />
      </div>

      <section className="section">
        <div className="grid-2">
          <article className="card">
            <span className="eyebrow">Moderation queue</span>
            <h3>Items needing review</h3>
            <table className="table">
              <tbody>
                <tr><td>Locum profile</td><td>Tariro Moyo</td><td><StatusBadge status="SUBMITTED" /></td></tr>
                <tr><td>Clinic profile</td><td>Westside Hospital</td><td><StatusBadge status="PENDING" /></td></tr>
                <tr><td>Document</td><td>Practicing certificate</td><td><StatusBadge status="UNDER_REVIEW" /></td></tr>
              </tbody>
            </table>
          </article>
          <article className="card">
            <span className="eyebrow">Platform controls</span>
            <h3>Admin workbench</h3>
            <p className="muted">Review profiles, approve jobs, verify documents, audit activity, and manage taxonomy from one console.</p>
            <div className="hero-actions">
              <Link href="/admin/approvals" className="btn">Open approvals</Link>
              <Link href="/admin/audit-logs" className="btn secondary">View audit logs</Link>
            </div>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
