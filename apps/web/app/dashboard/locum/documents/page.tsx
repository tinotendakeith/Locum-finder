import { DashboardShell, StatusBadge } from "../../../../components/dashboard-shell";
import { locumMenu } from "../../../../lib/ui";

export default function LocumDocumentsPage() {
  return (
    <DashboardShell title="Locum Dashboard" menu={locumMenu}>
      <h1>Documents</h1>
      <table className="table"><thead><tr><th>Document</th><th>Status</th></tr></thead><tbody><tr><td>CV.pdf</td><td><StatusBadge status="APPROVED" /></td></tr><tr><td>License.pdf</td><td><StatusBadge status="PENDING" /></td></tr></tbody></table>
    </DashboardShell>
  );
}
