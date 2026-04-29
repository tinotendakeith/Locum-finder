import { DashboardShell, StatusBadge } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

const locums = [
  ["Tariro Moyo", "General Practitioner", "Harare", "SUBMITTED"],
  ["Keith Nyoni", "Radiographer", "Bulawayo", "APPROVED"],
  ["Rudo Mavetera", "Pharmacist", "Mutare", "UNDER_REVIEW"],
];

export default function AdminLocumsPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu} currentPath="/admin/locums">
      <div className="section-head"><div><span className="eyebrow">Candidate moderation</span><h2>Locum profiles</h2></div></div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Name</th><th>Profession</th><th>Location</th><th>Status</th></tr></thead>
          <tbody>{locums.map(([name, profession, location, status]) => <tr key={name}><td>{name}</td><td>{profession}</td><td>{location}</td><td><StatusBadge status={status} /></td></tr>)}</tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
