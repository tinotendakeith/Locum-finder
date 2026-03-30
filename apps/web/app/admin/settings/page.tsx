import { DashboardShell } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

export default function AdminSettingsPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu}>
      <h1>Settings</h1>
      <div className="card"><p>Platform policy toggles, moderation settings, and notification templates.</p></div>
    </DashboardShell>
  );
}
