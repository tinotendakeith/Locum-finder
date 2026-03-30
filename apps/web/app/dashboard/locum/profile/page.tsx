import { DashboardShell, StatusBadge } from "../../../../components/dashboard-shell";
import { locumMenu } from "../../../../lib/ui";

export default function LocumProfilePage() {
  return (
    <DashboardShell title="Locum Dashboard" menu={locumMenu}>
      <h1>Profile</h1>
      <div className="card"><p>Profile status: <StatusBadge status="SUBMITTED" /></p><p>Manage specialties, qualifications, experience, and availability.</p></div>
    </DashboardShell>
  );
}
