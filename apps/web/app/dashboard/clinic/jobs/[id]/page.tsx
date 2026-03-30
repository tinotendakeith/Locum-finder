import { DashboardShell, StatusBadge } from "../../../../../components/dashboard-shell";
import { clinicMenu } from "../../../../../lib/ui";

export default function ClinicJobDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell title="Clinic Dashboard" menu={clinicMenu}>
      <h1>Job: {params.id}</h1>
      <div className="card">
        <p>Current status: <StatusBadge status="PENDING_APPROVAL" /></p>
        <p>Use this view to track applications, shortlist candidates, and close/fill the opening.</p>
      </div>
    </DashboardShell>
  );
}
