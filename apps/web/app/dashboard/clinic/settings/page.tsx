import { DashboardShell } from "../../../../components/dashboard-shell";
import { clinicMenu } from "../../../../lib/ui";

export default function ClinicSettingsPage() {
  return (
    <DashboardShell title="Clinic Dashboard" menu={clinicMenu}>
      <h1>Settings</h1>
      <form className="card form-grid"><input className="input" placeholder="Contact email" /><button className="btn">Save settings</button></form>
    </DashboardShell>
  );
}
