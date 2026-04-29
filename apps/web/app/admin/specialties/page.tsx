import { DashboardShell, StatusBadge } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

const specialties = ["General Practice", "Emergency Medicine", "General Nursing", "Surgical Nursing", "Pharmacy", "Radiography"];

export default function AdminSpecialtiesPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu} currentPath="/admin/specialties">
      <div className="section-head"><div><span className="eyebrow">Reference data</span><h2>Specialties</h2></div></div>
      <div className="grid-3">
        {specialties.map((specialty) => <article key={specialty} className="card"><h3>{specialty}</h3><p><StatusBadge status="ACTIVE" /></p></article>)}
      </div>
    </DashboardShell>
  );
}
