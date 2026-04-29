import Link from "next/link";
import { DashboardShell } from "../../../../components/dashboard-shell";
import { getPrivacyPreferences, requireUser } from "../../../../lib/local-auth";
import { locumMenu } from "../../../../lib/ui";

export default async function LocumSettingsPage() {
  const user = await requireUser("locum", "/dashboard/locum/settings");
  const preferences = getPrivacyPreferences(user.id);

  return (
    <DashboardShell title="Locum Dashboard" menu={locumMenu} currentPath="/dashboard/locum/settings" accountName={user.name} accountEmail={user.email}>
      <div className="section-head">
        <div>
          <span className="eyebrow">Privacy and notifications</span>
          <h2>Settings</h2>
        </div>
      </div>

      <div className="grid-2">
        <form className="card form-grid" action="/auth/privacy-preferences" method="post">
          <input type="hidden" name="returnTo" value="/dashboard/locum/settings" />
          <h3>Communication Preferences</h3>
          <label className="checkbox-row"><input type="checkbox" checked readOnly /><span>Account, security, and application emails are always enabled.</span></label>
          <label className="checkbox-row"><input type="checkbox" name="jobAlerts" defaultChecked={preferences.jobAlerts} /><span>Send job alerts that match my profession and location.</span></label>
          <label className="checkbox-row"><input type="checkbox" name="smsNotifications" defaultChecked={preferences.smsNotifications} /><span>Send SMS notifications for urgent application and interview updates.</span></label>
          <label className="checkbox-row"><input type="checkbox" name="marketingMessages" defaultChecked={preferences.marketingMessages} /><span>Send optional product updates and partner opportunities.</span></label>
          <button className="btn" type="submit">Save Preferences</button>
        </form>

        <article className="card compliance-panel">
          <h3>Your Privacy Rights</h3>
          <p className="muted">You can request access, correction, deletion, objection, or export of your Locum Finder data.</p>
          <Link href="/privacy/data-rights" className="btn secondary">Open Rights Request</Link>
        </article>
      </div>
    </DashboardShell>
  );
}
