import { DashboardShell, StatusBadge } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

export default function AdminApprovalsPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu}>
      <h1>Approval Queue</h1>
      <table className="table"><thead><tr><th>Type</th><th>Item</th><th>Status</th></tr></thead><tbody><tr><td>Locum Profile</td><td>Tariro Moyo</td><td><StatusBadge status="SUBMITTED" /></td></tr></tbody></table>
    </DashboardShell>
  );
}
