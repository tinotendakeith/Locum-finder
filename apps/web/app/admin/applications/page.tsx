import { DashboardShell, StatusBadge } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

const applications = [
  ["Tariro Moyo", "Weekend GP Cover", "Central Care Clinic", "UNDER_REVIEW"],
  ["Keith Nyoni", "Radiographer Locum", "Cimas Diagnostic Unit", "SHORTLISTED"],
  ["Rudo Mavetera", "Pharmacy Relief Shift", "Morningside Medical Centre", "SUBMITTED"],
];

export default function AdminApplicationsPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu} currentPath="/admin/applications">
      <div className="section-head"><div><span className="eyebrow">Hiring oversight</span><h2>Applications</h2></div></div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Candidate</th><th>Job</th><th>Facility</th><th>Status</th></tr></thead>
          <tbody>{applications.map(([candidate, job, facility, status]) => <tr key={`${candidate}-${job}`}><td>{candidate}</td><td>{job}</td><td>{facility}</td><td><StatusBadge status={status} /></td></tr>)}</tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
