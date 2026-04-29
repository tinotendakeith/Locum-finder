import Link from "next/link";
import { DashboardShell, MetricCard, StatusBadge } from "../../../components/dashboard-shell";
import { getApplicationsForLocum, getResumesForUser, requireUser } from "../../../lib/local-auth";
import { previewJobs } from "../../../lib/preview-platform";
import { locumMenu } from "../../../lib/ui";

export default async function LocumDashboardPage() {
  const user = await requireUser("locum", "/dashboard/locum");
  const resumes = getResumesForUser(user.id);
  const applications = getApplicationsForLocum(user.id);
  const suggestedJobs = previewJobs.slice(0, 3);

  return (
    <DashboardShell title="Locum Dashboard" menu={locumMenu} currentPath="/dashboard/locum" accountName={user.name} accountEmail={user.email}>
      <div className="metric-row">
        <MetricCard label="Saved resumes" value={resumes.length} />
        <MetricCard label="Applications" value={applications.length} />
        <MetricCard label="Shortlisted" value={applications.filter((item) => item.status === "SHORTLISTED").length} />
        <MetricCard label="Verification" value="Active" />
      </div>

      <section className="section">
        <div className="grid-2">
          <article className="card">
            <span className="eyebrow">Profile readiness</span>
            <h3>Fast apply status</h3>
            <p className="muted">Your account can apply by selecting a saved resume and adding a short message.</p>
            <p>Account status: <StatusBadge status="APPROVED" /></p>
            <p>Availability: weekend and short-notice cover</p>
            <div className="hero-actions">
              <Link href="/dashboard/locum/profile" className="btn">Edit profile</Link>
              <Link href="/dashboard/locum/applications" className="btn secondary">View applications</Link>
            </div>
          </article>

          <article className="card">
            <span className="eyebrow">Suggested work</span>
            <h3>Recommended vacancies</h3>
            <table className="table">
              <tbody>
                {suggestedJobs.map((job) => (
                  <tr key={job.id}>
                    <td><strong>{job.title}</strong><br /><span className="muted">{job.facility}</span></td>
                    <td>{job.city}</td>
                    <td><Link href={`/jobs/${job.id}`} className="btn secondary">Open</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
