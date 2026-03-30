import { DashboardShell, StatusBadge } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

export default function AdminJobsPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu}>
      <h1>Jobs</h1>
      <table className="table"><thead><tr><th>Title</th><th>Facility</th><th>Status</th></tr></thead><tbody><tr><td>Weekend GP Cover</td><td>Central Care Clinic</td><td><StatusBadge status="PENDING_APPROVAL" /></td></tr></tbody></table>
    </DashboardShell>
  );
}
