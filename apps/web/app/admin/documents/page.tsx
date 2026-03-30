import { DashboardShell, StatusBadge } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

export default function AdminDocumentsPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu}>
      <h1>Documents</h1>
      <table className="table"><thead><tr><th>Owner</th><th>Document</th><th>Status</th></tr></thead><tbody><tr><td>Tariro Moyo</td><td>License.pdf</td><td><StatusBadge status="PENDING" /></td></tr></tbody></table>
    </DashboardShell>
  );
}
