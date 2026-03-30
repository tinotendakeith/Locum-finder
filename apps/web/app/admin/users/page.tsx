import { DashboardShell, StatusBadge } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

export default function AdminUsersPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu}>
      <h1>Users</h1>
      <table className="table"><thead><tr><th>Email</th><th>Role</th><th>Status</th></tr></thead><tbody><tr><td>locum@locumfinder.test</td><td>LOCUM</td><td><StatusBadge status="ACTIVE" /></td></tr></tbody></table>
    </DashboardShell>
  );
}
