import { DashboardShell, StatusBadge } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

export default function AdminClinicsPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu}>
      <h1>Clinic Profiles</h1>
      <table className="table"><thead><tr><th>Facility</th><th>Status</th></tr></thead><tbody><tr><td>Central Care Clinic</td><td><StatusBadge status="APPROVED" /></td></tr></tbody></table>
    </DashboardShell>
  );
}
