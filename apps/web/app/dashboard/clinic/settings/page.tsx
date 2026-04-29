import Link from "next/link";
import { DashboardShell } from "../../../../components/dashboard-shell";
import { getPrivacyPreferences, requireUser } from "../../../../lib/local-auth";
import { clinicMenu } from "../../../../lib/ui";

export default async function ClinicSettingsPage() {
  const user = await requireUser("clinic", "/dashboard/clinic/settings");
  const preferences = getPrivacyPreferences(user.id);

  return (
    <DashboardShell title="Clinic Dashboard" menu={clinicMenu} currentPath="/dashboard/clinic/settings" accountName={user.name} accountEmail={user.email}>
      <div className="section-head">
        <div>
          <span className="eyebrow">Privacy and notifications</span>
          <h2>Settings</h2>
        </div>
      </div>

      <div className="grid-2">
        <form className="card form-grid" action="/auth/privacy-preferences" method="post">
          <input type="hidden" name="returnTo" value="/dashboard/clinic/settings" />
          <h3>Communication Preferences</h3>
          <label className="checkbox-row"><input type="checkbox" checked readOnly /><span>Account, security, vacancy, and applicant-processing emails are always enabled.</span></label>
          <label className="checkbox-row"><input type="checkbox" name="jobAlerts" defaultChecked={preferences.jobAlerts} /><span>Send vacancy performance and applicant digest emails.</span></label>
          <label className="checkbox-row"><input type="checkbox" name="smsNotifications" defaultChecked={preferences.smsNotifications} /><span>Send SMS alerts for urgent applicant updates.</span></label>
          <label className="checkbox-row"><input type="checkbox" name="marketingMessages" defaultChecked={preferences.marketingMessages} /><span>Send optional product updates and partner offers.</span></label>
          <button className="btn" type="submit">Save Preferences</button>
        </form>

        <article className="card compliance-panel">
          <h3>Clinic Data Responsibilities</h3>
          <p className="muted">Only upload lawful vacancy, contact, and applicant-processing information. Candidate data should be used only for the vacancy workflow.</p>
          <Link href="/privacy" className="btn secondary">Review Privacy Notice</Link>
        </article>
      </div>
    </DashboardShell>
  );
}
