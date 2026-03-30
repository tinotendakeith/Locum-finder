import { DashboardShell, StatusBadge } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

export default function AdminLocumsPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu}>
      <h1>Locum Profiles</h1>
      <table className="table"><thead><tr><th>Name</th><th>Status</th></tr></thead><tbody><tr><td>Tariro Moyo</td><td><StatusBadge status="SUBMITTED" /></td></tr></tbody></table>
    </DashboardShell>
  );
}
