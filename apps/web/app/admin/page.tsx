import { DashboardShell, MetricCard } from "../../components/dashboard-shell";
import { adminMenu } from "../../lib/ui";

export default function AdminDashboardPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu}>
      <h1>Admin Dashboard</h1>
      <div className="metric-row">
        <MetricCard label="Pending Approvals" value={12} />
        <MetricCard label="Users" value={425} />
        <MetricCard label="Jobs" value={98} />
        <MetricCard label="Applications" value={1204} />
      </div>
    </DashboardShell>
  );
}
