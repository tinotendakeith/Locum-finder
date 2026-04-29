import Link from "next/link";
import { DashboardShell, StatusBadge } from "../../../components/dashboard-shell";
import { previewJobs } from "../../../lib/preview-platform";
import { adminMenu } from "../../../lib/ui";

export default function AdminJobsPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu} currentPath="/admin/jobs">
      <div className="section-head"><div><span className="eyebrow">Marketplace</span><h2>Jobs</h2></div></div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Title</th><th>Facility</th><th>Location</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {previewJobs.map((job, index) => (
              <tr key={job.id}>
                <td>{job.title}</td><td>{job.facility}</td><td>{job.city}</td>
                <td><StatusBadge status={index === 0 ? "PUBLISHED" : "PENDING_APPROVAL"} /></td>
                <td><Link href={`/jobs/${job.id}`} className="btn secondary">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
