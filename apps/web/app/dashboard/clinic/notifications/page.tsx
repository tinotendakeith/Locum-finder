import { DashboardShell } from "../../../../components/dashboard-shell";
import { clinicMenu } from "../../../../lib/ui";

export default function ClinicNotificationsPage() {
  return (
    <DashboardShell title="Clinic Dashboard" menu={clinicMenu}>
      <h1>Notifications</h1>
      <div className="card"><p>Your latest job was approved by admin moderation.</p></div>
    </DashboardShell>
  );
}
