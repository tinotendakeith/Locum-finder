import { DashboardShell, StatusBadge } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

export default function AdminApplicationsPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu}>
      <h1>Applications</h1>
      <table className="table"><thead><tr><th>Candidate</th><th>Job</th><th>Status</th></tr></thead><tbody><tr><td>Tariro Moyo</td><td>Weekend GP Cover</td><td><StatusBadge status="UNDER_REVIEW" /></td></tr></tbody></table>
    </DashboardShell>
  );
}
