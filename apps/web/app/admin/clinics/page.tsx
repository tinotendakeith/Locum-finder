import { DashboardShell, StatusBadge } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

const clinics = [
  ["Central Care Clinic", "Harare", "Clinic", "APPROVED"],
  ["Westside Hospital", "Bulawayo", "Hospital", "PENDING"],
  ["Morningside Medical Centre", "Harare", "Medical Centre", "APPROVED"],
];

export default function AdminClinicsPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu} currentPath="/admin/clinics">
      <div className="section-head"><div><span className="eyebrow">Employer moderation</span><h2>Clinic profiles</h2></div></div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Facility</th><th>City</th><th>Type</th><th>Status</th></tr></thead>
          <tbody>{clinics.map(([facility, city, type, status]) => <tr key={facility}><td>{facility}</td><td>{city}</td><td>{type}</td><td><StatusBadge status={status} /></td></tr>)}</tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
