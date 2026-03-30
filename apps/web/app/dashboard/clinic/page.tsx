import { DashboardShell, MetricCard } from "../../../components/dashboard-shell";
import { clinicMenu } from "../../../lib/ui";

export default function ClinicDashboardPage() {
  return (
    <DashboardShell title="Clinic Dashboard" menu={clinicMenu}>
      <h1>Overview</h1>
      <div className="metric-row">
        <MetricCard label="Active Jobs" value={5} />
        <MetricCard label="Pending Jobs" value={2} />
        <MetricCard label="Applicants" value={18} />
        <MetricCard label="Shortlisted" value={7} />
      </div>
    </DashboardShell>
  );
}
