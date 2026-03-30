import { DashboardShell, StatusBadge } from "../../../../components/dashboard-shell";
import { clinicMenu } from "../../../../lib/ui";

export default function ClinicProfilePage() {
  return (
    <DashboardShell title="Clinic Dashboard" menu={clinicMenu}>
      <h1>Facility Profile</h1>
      <div className="card"><p>Status: <StatusBadge status="APPROVED" /></p><p>Manage facility details, departments, and verification data.</p></div>
    </DashboardShell>
  );
}
