import { DashboardShell } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

export default function AdminSpecialtiesPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu}>
      <h1>Specialties</h1>
      <div className="card"><p>Reference taxonomy management for specialties and professions.</p></div>
    </DashboardShell>
  );
}
