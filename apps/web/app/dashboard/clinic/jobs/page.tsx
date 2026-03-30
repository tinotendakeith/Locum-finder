import Link from "next/link";
import { DashboardShell, StatusBadge } from "../../../../components/dashboard-shell";
import { clinicMenu } from "../../../../lib/ui";

export default function ClinicJobsPage() {
  return (
    <DashboardShell title="Clinic Dashboard" menu={clinicMenu}>
      <h1>Manage Jobs</h1>
      <div style={{ marginBottom: 12 }}><Link href="/dashboard/clinic/jobs/new" className="btn">New Job</Link></div>
      <table className="table"><thead><tr><th>Title</th><th>Status</th><th></th></tr></thead><tbody><tr><td>Weekend GP Cover</td><td><StatusBadge status="ACTIVE" /></td><td><Link href="/dashboard/clinic/jobs/job-1" className="btn secondary">Open</Link></td></tr></tbody></table>
    </DashboardShell>
  );
}
