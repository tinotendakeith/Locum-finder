import Link from "next/link";
import { DashboardShell, MetricCard, StatusBadge } from "../../../components/dashboard-shell";
import { getApplicationsForClinic, getClinicProfile, requireUser } from "../../../lib/local-auth";
import { previewJobs } from "../../../lib/preview-platform";
import { clinicMenu } from "../../../lib/ui";

export default async function ClinicDashboardPage() {
  const user = await requireUser("clinic", "/dashboard/clinic");
  const applications = getApplicationsForClinic(user.email);
  const profile = getClinicProfile(user.id);
  const clinicJobs = previewJobs.filter((job) => job.clinicEmail === user.email).slice(0, 4);

  return (
    <DashboardShell title="Clinic Dashboard" menu={clinicMenu} currentPath="/dashboard/clinic" accountName={user.name} accountEmail={user.email}>
      <div className="metric-row">
        <MetricCard label="Active jobs" value={clinicJobs.length || 5} />
        <MetricCard label="Applicants" value={applications.length} />
        <MetricCard label="Under review" value={applications.filter((item) => item.status === "UNDER_REVIEW").length} />
        <MetricCard label="Facility" value={profile?.facilityName || user.name} />
      </div>

      <section className="section">
        <div className="grid-2">
          <article className="card">
            <span className="eyebrow">Hiring pipeline</span>
            <h3>Recent applicants</h3>
            <table className="table">
              <thead>
                <tr><th>Candidate</th><th>Role</th><th>Status</th></tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.applicantName}</td>
                    <td>{application.jobTitle}</td>
                    <td><StatusBadge status={application.status} /></td>
                  </tr>
                ))}
                {!applications.length ? <tr><td colSpan={3}>No applications yet.</td></tr> : null}
              </tbody>
            </table>
          </article>

          <article className="card">
            <span className="eyebrow">Vacancy controls</span>
            <h3>Post, review, and fill shifts</h3>
            <p className="muted">Create vacancies, receive resume-based applications, and move candidates through review, shortlist, approval, and rejection states.</p>
            <div className="hero-actions">
              <Link href="/dashboard/clinic/jobs/new" className="btn">Post a vacancy</Link>
              <Link href="/dashboard/clinic/applicants" className="btn secondary">Review applicants</Link>
            </div>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
