import Link from "next/link";
import { DashboardShell } from "../../../../components/dashboard-shell";
import { previewJobs } from "../../../../lib/preview-platform";
import { locumMenu } from "../../../../lib/ui";

export default function LocumSavedJobsPage() {
  return (
    <DashboardShell title="Locum Dashboard" menu={locumMenu} currentPath="/dashboard/locum/saved-jobs">
      <div className="section-head"><div><span className="eyebrow">Bookmarks</span><h2>Saved jobs</h2></div></div>
      <div className="jobs-grid">
        {previewJobs.slice(0, 3).map((job) => (
          <article className="job-card" key={job.id}>
            <div className="job-card-top"><span className="job-chip">{job.type}</span><span className="job-rate">{job.rate}</span></div>
            <div className="job-card-body"><h3>{job.title}</h3><p className="muted">{job.facility} - {job.city}</p><p>{job.summary}</p></div>
            <div className="job-card-footer"><Link href={`/jobs/${job.id}`} className="btn secondary">Open</Link></div>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
