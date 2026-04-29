import { DashboardShell } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

const logs = [
  ["2026-03-06 10:30", "admin@locumfinder.test", "JOB_REVIEWED", "Weekend GP Cover"],
  ["2026-03-06 10:42", "clinic@locumfinder.test", "APPLICATION_STATUS_CHANGED", "application-demo-1"],
  ["2026-03-06 11:05", "admin@locumfinder.test", "DOCUMENT_APPROVED", "qualification-certificate"],
];

export default function AdminAuditLogsPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu} currentPath="/admin/audit-logs">
      <div className="section-head"><div><span className="eyebrow">Compliance trail</span><h2>Audit logs</h2></div></div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Entity</th></tr></thead>
          <tbody>{logs.map(([time, actor, action, entity]) => <tr key={`${time}-${action}`}><td>{time}</td><td>{actor}</td><td>{action}</td><td>{entity}</td></tr>)}</tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
