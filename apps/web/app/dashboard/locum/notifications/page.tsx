import { DashboardShell } from "../../../../components/dashboard-shell";
import { locumMenu } from "../../../../lib/ui";

export default function LocumNotificationsPage() {
  return (
    <DashboardShell title="Locum Dashboard" menu={locumMenu}>
      <h1>Notifications</h1>
      <div className="card"><p>Application shortlisted for Weekend GP Cover.</p></div>
    </DashboardShell>
  );
}
