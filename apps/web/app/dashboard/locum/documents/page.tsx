import { DashboardShell, StatusBadge } from "../../../../components/dashboard-shell";
import { locumMenu } from "../../../../lib/ui";

const docs = [
  ["CV / Resume PDF", "APPROVED"],
  ["Qualification certificate", "PENDING"],
  ["Practicing certificate", "UNDER_REVIEW"],
  ["Profile photo", "APPROVED"],
];

export default function LocumDocumentsPage() {
  return (
    <DashboardShell title="Locum Dashboard" menu={locumMenu} currentPath="/dashboard/locum/documents">
      <div className="section-head"><div><span className="eyebrow">Verification</span><h2>Documents</h2></div></div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Document</th><th>Status</th></tr></thead>
          <tbody>{docs.map(([name, status]) => <tr key={name}><td>{name}</td><td><StatusBadge status={status} /></td></tr>)}</tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
