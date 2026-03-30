import { DashboardShell } from "../../../../components/dashboard-shell";
import { locumMenu } from "../../../../lib/ui";

export default function LocumSavedJobsPage() {
  return (
    <DashboardShell title="Locum Dashboard" menu={locumMenu}>
      <h1>Saved Jobs</h1>
      <div className="card"><p>No saved jobs yet. Browse opportunities and bookmark relevant shifts.</p></div>
    </DashboardShell>
  );
}
