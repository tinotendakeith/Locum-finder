import { DashboardShell, StatusBadge } from "../../../../components/dashboard-shell";
import { getClinicProfile, requireUser } from "../../../../lib/local-auth";
import { clinicMenu } from "../../../../lib/ui";

function valueOf(input: string | string[] | undefined) {
  return Array.isArray(input) ? (input[0] ?? "") : (input ?? "");
}

export default async function ClinicProfilePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const user = await requireUser("clinic", "/dashboard/clinic/profile");
  const profile = getClinicProfile(user.id);
  const onboarding = valueOf(params.onboarding) === "1";
  const saved = valueOf(params.saved) === "1";

  return (
    <DashboardShell title="Clinic Dashboard" menu={clinicMenu} currentPath="/dashboard/clinic/profile" accountName={user.name} accountEmail={user.email}>
      <div className="section-head">
        <div>
          <span className="eyebrow">Facility profile</span>
          <h2>Clinic details</h2>
        </div>
        <StatusBadge status={profile?.description ? "APPROVED" : "PENDING_PROFILE_COMPLETION"} />
      </div>

      {onboarding ? <p className="badge warning">Clinic account created. Complete this profile before posting vacancies.</p> : null}
      {saved ? <p className="badge success">Clinic profile saved successfully.</p> : null}

      <form className="card form-grid" action="/auth/clinic-profile" method="post">
        <div className="grid-2">
          <label>
            <span>Facility name</span>
            <input name="facilityName" className="input" defaultValue={profile?.facilityName ?? user.name} />
          </label>
          <label>
            <span>Organization type</span>
            <select name="organizationType" className="select" defaultValue={profile?.organizationType ?? "clinic"}>
              <option value="clinic">Clinic</option>
              <option value="hospital">Hospital</option>
              <option value="medical-centre">Medical Centre</option>
              <option value="private-practice">Private Practice</option>
            </select>
          </label>
          <label>
            <span>City</span>
            <input name="city" className="input" defaultValue={profile?.city ?? ""} placeholder="Harare" />
          </label>
          <label>
            <span>Phone</span>
            <input name="phone" className="input" defaultValue={profile?.phone ?? ""} placeholder="+263..." />
          </label>
          <label>
            <span>Email</span>
            <input name="email" className="input" defaultValue={profile?.email ?? user.email} />
          </label>
          <label>
            <span>Website</span>
            <input name="website" className="input" defaultValue={profile?.website ?? ""} placeholder="https://clinic.co.zw" />
          </label>
        </div>

        <label>
          <span>Contact person</span>
          <input name="contactPerson" className="input" defaultValue={profile?.contactPerson ?? ""} placeholder="Operations Manager" />
        </label>
        <label>
          <span>Description</span>
          <textarea name="description" className="textarea" defaultValue={profile?.description ?? ""} placeholder="Describe departments, services, and typical locum needs." />
        </label>
        <button type="submit" className="btn">Save clinic profile</button>
      </form>
    </DashboardShell>
  );
}
