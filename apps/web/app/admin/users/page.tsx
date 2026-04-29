import { DashboardShell, StatusBadge } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

const users = [
  ["locum@locumfinder.test", "LOCUM", "ACTIVE"],
  ["clinic@locumfinder.test", "CLINIC", "ACTIVE"],
  ["admin@locumfinder.test", "ADMIN", "ACTIVE"],
  ["newdoctor@example.com", "LOCUM", "PENDING_APPROVAL"],
];

export default function AdminUsersPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu} currentPath="/admin/users">
      <div className="section-head"><div><span className="eyebrow">Identity</span><h2>Users</h2></div></div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Email</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>{users.map(([email, role, status]) => <tr key={email}><td>{email}</td><td>{role}</td><td><StatusBadge status={status} /></td></tr>)}</tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
