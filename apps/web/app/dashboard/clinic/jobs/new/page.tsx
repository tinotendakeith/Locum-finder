import { DashboardShell } from "../../../../../components/dashboard-shell";
import { getClinicProfile, requireUser } from "../../../../../lib/local-auth";
import { clinicMenu } from "../../../../../lib/ui";

export default async function ClinicNewJobPage() {
  const user = await requireUser("clinic", "/dashboard/clinic/jobs/new");
  const profile = getClinicProfile(user.id);

  return (
    <DashboardShell title="Clinic Dashboard" menu={clinicMenu} currentPath="/dashboard/clinic/jobs/new" accountName={user.name} accountEmail={user.email}>
      <div className="section-head">
        <div>
          <span className="eyebrow">Post a vacancy</span>
          <h2>Create locum job</h2>
        </div>
      </div>

      <form className="card form-grid">
        <div className="grid-2">
          <label>
            <span>Job title</span>
            <input className="input" placeholder="Weekend GP Cover" />
          </label>
          <label>
            <span>Profession</span>
            <select className="select" defaultValue="">
              <option value="" disabled>Choose profession</option>
              <option>Doctor</option>
              <option>Nurse</option>
              <option>Pharmacist</option>
              <option>Radiographer</option>
            </select>
          </label>
          <label>
            <span>Location</span>
            <input className="input" placeholder="Harare" />
          </label>
          <label>
            <span>Rate</span>
            <input className="input" placeholder="USD 45/hr" />
          </label>
          <label>
            <span>Shift dates</span>
            <input className="input" placeholder="Saturday and Sunday, 08:00 - 17:00" />
          </label>
          <label>
            <span>Urgency</span>
            <select className="select" defaultValue="medium">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </label>
        </div>

        <label>
          <span>Description</span>
          <textarea className="textarea" placeholder="Describe responsibilities, patient load, cover dates, and clinical expectations." />
        </label>
        <label>
          <span>Requirements</span>
          <textarea className="textarea" placeholder="Registration, certifications, experience level, and required documents." />
        </label>

        <div className="grid-2">
          <label>
            <span>Facility</span>
            <input className="input" defaultValue={profile?.facilityName ?? user.name} />
          </label>
          <label>
            <span>Application email</span>
            <input className="input" type="email" defaultValue={profile?.email ?? user.email} />
          </label>
        </div>

        <div className="hero-actions">
          <button type="button" className="btn secondary">Preview</button>
          <button type="button" className="btn">Save draft</button>
        </div>
      </form>
    </DashboardShell>
  );
}
