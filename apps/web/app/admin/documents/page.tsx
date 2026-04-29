import { DashboardShell, StatusBadge } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

const documents = [
  ["Tariro Moyo", "Practicing certificate", "PENDING"],
  ["Keith Nyoni", "Qualification certificate", "APPROVED"],
  ["Westside Hospital", "Operating license", "UNDER_REVIEW"],
];

export default function AdminDocumentsPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu} currentPath="/admin/documents">
      <div className="section-head"><div><span className="eyebrow">Verification</span><h2>Documents</h2></div></div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Owner</th><th>Document</th><th>Status</th></tr></thead>
          <tbody>{documents.map(([owner, doc, status]) => <tr key={`${owner}-${doc}`}><td>{owner}</td><td>{doc}</td><td><StatusBadge status={status} /></td></tr>)}</tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
