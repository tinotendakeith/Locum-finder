import { DashboardShell } from "../../../../../components/dashboard-shell";
import { clinicMenu } from "../../../../../lib/ui";

export default function ClinicNewJobPage() {
  return (
    <DashboardShell title="Clinic Dashboard" menu={clinicMenu}>
      <h1>Create Job</h1>
      <form className="card form-grid">
        <input className="input" placeholder="Title" />
        <input className="input" placeholder="Profession" />
        <input className="input" placeholder="Specialty" />
        <input className="input" placeholder="City" />
        <textarea className="textarea" placeholder="Description" />
        <button className="btn">Save Draft</button>
      </form>
    </DashboardShell>
  );
}
