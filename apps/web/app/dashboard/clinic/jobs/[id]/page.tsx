import Link from "next/link";
import { DashboardShell, StatusBadge } from "../../../../../components/dashboard-shell";
import { getPreviewJob } from "../../../../../lib/preview-platform";
import { clinicMenu } from "../../../../../lib/ui";

export default async function ClinicJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getPreviewJob(id);

  return (
    <DashboardShell title="Clinic Dashboard" menu={clinicMenu} currentPath="/dashboard/clinic/jobs">
      <div className="section-head">
        <div>
          <span className="eyebrow">Vacancy operations</span>
          <h2>{job?.title ?? `Job ${id}`}</h2>
        </div>
        <StatusBadge status="PENDING_APPROVAL" />
      </div>

      <div className="grid-2">
        <article className="card">
          <h3>Listing details</h3>
          <p><strong>Facility:</strong> {job?.facility ?? "Unknown facility"}</p>
          <p><strong>Location:</strong> {job?.city ?? "Not provided"}</p>
          <p><strong>Rate:</strong> {job?.rate ?? "Not provided"}</p>
          <p className="muted">{job?.description ?? "Use this view to track applications, shortlist candidates, and close or fill the opening."}</p>
          <div className="hero-actions">
            <Link href={job ? `/jobs/${job.id}` : "/jobs"} className="btn secondary">Public preview</Link>
            <button type="button" className="btn">Publish</button>
          </div>
        </article>
        <article className="card">
          <h3>Hiring actions</h3>
          <table className="table">
            <tbody>
              <tr><td>Applications</td><td>1</td></tr>
              <tr><td>Shortlisted</td><td>0</td></tr>
              <tr><td>Messages</td><td>0</td></tr>
            </tbody>
          </table>
          <div className="hero-actions">
            <Link href="/dashboard/clinic/applicants" className="btn">Review applicants</Link>
            <button type="button" className="btn secondary">Mark filled</button>
          </div>
        </article>
      </div>
    </DashboardShell>
  );
}
