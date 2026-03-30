import { DashboardShell, StatusBadge } from "../../../../components/dashboard-shell";
import { clinicMenu } from "../../../../lib/ui";

export default function ClinicApplicantsPage() {
  return (
    <DashboardShell title="Clinic Dashboard" menu={clinicMenu}>
      <h1>Applicants</h1>
      <table className="table"><thead><tr><th>Candidate</th><th>Job</th><th>Status</th></tr></thead><tbody><tr><td>Tariro Moyo</td><td>Weekend GP Cover</td><td><StatusBadge status="SHORTLISTED" /></td></tr></tbody></table>
    </DashboardShell>
  );
}
