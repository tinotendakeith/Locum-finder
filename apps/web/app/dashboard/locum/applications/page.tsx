import { DashboardShell, StatusBadge } from "../../../../components/dashboard-shell";
import { locumMenu } from "../../../../lib/ui";

export default function LocumApplicationsPage() {
  return (
    <DashboardShell title="Locum Dashboard" menu={locumMenu}>
      <h1>Applications</h1>
      <table className="table"><thead><tr><th>Job</th><th>Facility</th><th>Status</th></tr></thead><tbody><tr><td>Weekend GP Cover</td><td>Central Care Clinic</td><td><StatusBadge status="UNDER_REVIEW" /></td></tr></tbody></table>
    </DashboardShell>
  );
}
