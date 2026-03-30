import { DashboardShell } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

export default function AdminAuditLogsPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu}>
      <h1>Audit Logs</h1>
      <table className="table"><thead><tr><th>Timestamp</th><th>Actor</th><th>Action</th></tr></thead><tbody><tr><td>2026-03-06 10:30</td><td>admin@locumfinder.test</td><td>JOB_REVIEWED</td></tr></tbody></table>
    </DashboardShell>
  );
}
