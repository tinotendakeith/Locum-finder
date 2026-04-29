import Link from "next/link";
import { DashboardShell, StatusBadge } from "../../../../components/dashboard-shell";
import { getApplicationsForLocum, requireUser } from "../../../../lib/local-auth";
import { locumMenu } from "../../../../lib/ui";

export default async function LocumApplicationsPage() {
  const user = await requireUser("locum", "/dashboard/locum/applications");
  const applications = getApplicationsForLocum(user.id);

  return (
    <DashboardShell title="Locum Dashboard" menu={locumMenu} currentPath="/dashboard/locum/applications" accountName={user.name} accountEmail={user.email}>
      <div className="section-head">
        <div>
          <span className="eyebrow">Application history</span>
          <h2>Track submitted vacancies</h2>
        </div>
        <Link href="/jobs" className="btn">Browse jobs</Link>
      </div>

      {applications.length ? (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Facility</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Applied</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td><strong>{application.jobTitle}</strong></td>
                  <td>{application.facilityName}</td>
                  <td>{application.resumeTitle}</td>
                  <td><StatusBadge status={application.status} /></td>
                  <td>{new Date(application.appliedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card">
          <h3>No applications yet</h3>
          <p className="muted">Once you apply using a saved resume, your submissions will appear here.</p>
          <Link href="/jobs" className="btn secondary">Browse vacancies</Link>
        </div>
      )}
    </DashboardShell>
  );
}
