import Link from "next/link";
import { DashboardShell, StatusBadge } from "../../../../components/dashboard-shell";
import { getApplicationsForClinic, requireUser } from "../../../../lib/local-auth";
import { clinicMenu } from "../../../../lib/ui";

export default async function ClinicApplicantsPage() {
  const user = await requireUser("clinic", "/dashboard/clinic/applicants");
  const applications = getApplicationsForClinic(user.email);

  return (
    <DashboardShell title="Clinic Dashboard" menu={clinicMenu} currentPath="/dashboard/clinic/applicants" accountName={user.name} accountEmail={user.email}>
      <div className="section-head">
        <div>
          <span className="eyebrow">Applications</span>
          <h2>Applicant review</h2>
        </div>
      </div>

      {applications.length ? (
        <div className="grid-2">
          {applications.map((application) => (
            <article key={application.id} className="card">
              <div className="job-card-top">
                <div>
                  <h3>{application.applicantName}</h3>
                  <p className="muted">{application.jobTitle} - {application.resumeTitle}</p>
                </div>
                <StatusBadge status={application.status} />
              </div>
              <p><strong>Facility:</strong> {application.facilityName}</p>
              <p><strong>Message:</strong> {application.message || "No message included."}</p>
              <p><strong>Applied:</strong> {new Date(application.appliedAt).toLocaleString()}</p>
              <div className="job-tags">
                <span>Shortlist</span>
                <span>Approve</span>
                <span>Reject</span>
                <span>Message</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card">
          <h3>No applicants yet</h3>
          <p className="muted">When a locum applies with a saved resume, the application appears here for clinic review.</p>
          <Link href="/jobs/job-1" className="btn secondary">Open sample vacancy</Link>
        </div>
      )}
    </DashboardShell>
  );
}
