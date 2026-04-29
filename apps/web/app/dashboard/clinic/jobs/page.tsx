import Link from "next/link";
import { DashboardShell, StatusBadge } from "../../../../components/dashboard-shell";
import { previewJobs } from "../../../../lib/preview-platform";
import { clinicMenu } from "../../../../lib/ui";

export default function ClinicJobsPage() {
  return (
    <DashboardShell title="Clinic Dashboard" menu={clinicMenu} currentPath="/dashboard/clinic/jobs">
      <div className="section-head">
        <div>
          <span className="eyebrow">Vacancies</span>
          <h2>Manage jobs</h2>
        </div>
        <Link href="/dashboard/clinic/jobs/new" className="btn">New Job</Link>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr><th>Title</th><th>Facility</th><th>Location</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {previewJobs.slice(0, 5).map((job, index) => (
              <tr key={job.id}>
                <td><strong>{job.title}</strong><br /><span className="muted">{job.specialty}</span></td>
                <td>{job.facility}</td>
                <td>{job.city}</td>
                <td><StatusBadge status={index === 1 ? "UNDER_REVIEW" : "ACTIVE"} /></td>
                <td><Link href={`/dashboard/clinic/jobs/${job.id}`} className="btn secondary">Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
