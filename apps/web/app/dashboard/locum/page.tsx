import { DashboardShell, MetricCard, StatusBadge } from "../../../components/dashboard-shell";
import { locumMenu } from "../../../lib/ui";

export default function LocumDashboardPage() {
  return (
    <DashboardShell title="Locum Dashboard" menu={locumMenu}>
      <h1>Overview</h1>
      <div className="metric-row">
        <MetricCard label="Profile Completion" value="90%" />
        <MetricCard label="Applications" value={12} />
        <MetricCard label="Saved Jobs" value={6} />
        <MetricCard label="Profile Status" value="Approved" />
      </div>
      <div className="card"><h3>Current Profile Status</h3><StatusBadge status="APPROVED" /></div>
    </DashboardShell>
  );
}
