import { DashboardShell, StatusBadge } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

export default function AdminSettingsPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu} currentPath="/admin/settings">
      <div className="section-head"><div><span className="eyebrow">Platform policy</span><h2>Settings</h2></div></div>
      <div className="grid-2">
        <article className="card"><h3>Profile approvals</h3><p className="muted">Require admin review before locums and clinics become visible.</p><StatusBadge status="ACTIVE" /></article>
        <article className="card"><h3>Job moderation</h3><p className="muted">Hold new jobs for moderation before public publishing.</p><StatusBadge status="ACTIVE" /></article>
        <article className="card"><h3>Document verification</h3><p className="muted">Track certificates and licenses before high-trust actions.</p><StatusBadge status="ACTIVE" /></article>
        <article className="card"><h3>Notification templates</h3><p className="muted">Application, review, shortlist, approval, and rejection messages.</p><StatusBadge status="DRAFT" /></article>
      </div>
    </DashboardShell>
  );
}
