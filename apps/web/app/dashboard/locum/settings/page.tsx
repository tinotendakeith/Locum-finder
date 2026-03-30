import { DashboardShell } from "../../../../components/dashboard-shell";
import { locumMenu } from "../../../../lib/ui";

export default function LocumSettingsPage() {
  return (
    <DashboardShell title="Locum Dashboard" menu={locumMenu}>
      <h1>Settings</h1>
      <form className="card form-grid"><input className="input" placeholder="Phone" /><button className="btn">Save</button></form>
    </DashboardShell>
  );
}
