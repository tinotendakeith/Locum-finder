import Link from "next/link";
import { DashboardShell, StatusBadge } from "../../../components/dashboard-shell";
import { getDataRightsRequests, requireUser } from "../../../lib/local-auth";
import { adminMenu } from "../../../lib/ui";

const complianceTasks = [
  ["P0", "Disable sensitive request/body logging", "Done in product policy; enforce in backend logging review"],
  ["P0", "Rotate and move secrets to environment variables", "Ops checklist"],
  ["P0", "Lock down exports to approved fields", "Build before data export launch"],
  ["P1", "Consent capture on registration", "Implemented in web registration"],
  ["P1", "DSAR request workflow", "Implemented intake queue"],
  ["P1", "Retention and purge schedules", "Needs backend job and DPO-approved schedule"],
  ["P2", "DPIA and vendor DPAs", "DPO/legal workflow"],
  ["P2", "Audit trails for data access", "Admin trail visible, backend events next"],
];

export default async function AdminPrivacyPage() {
  const user = await requireUser("admin", "/admin/privacy");
  const requests = getDataRightsRequests();

  return (
    <DashboardShell title="Admin Console" menu={adminMenu} currentPath="/admin/privacy" accountName={user.name} accountEmail={user.email}>
      <div className="section-head">
        <div>
          <span className="eyebrow">DPO workspace</span>
          <h2>Privacy and Compliance</h2>
        </div>
        <Link href="/privacy" className="btn secondary">Public Notice</Link>
      </div>

      <div className="grid-3">
        <article className="metric-card"><p>PII categories tracked</p><h3>5</h3></article>
        <article className="metric-card"><p>Open rights requests</p><h3>{requests.filter((item) => item.status !== "COMPLETED").length}</h3></article>
        <article className="metric-card"><p>Breach reporting SLA</p><h3>24h</h3></article>
      </div>

      <section className="card">
        <h3>Data Rights Queue</h3>
        <table className="table">
          <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Type</th><th>Status</th></tr></thead>
          <tbody>
            {requests.length ? requests.map((request) => (
              <tr key={request.id}>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                <td>{request.name}</td>
                <td>{request.email}</td>
                <td>{request.requestType}</td>
                <td><StatusBadge status={request.status} /></td>
              </tr>
            )) : (
              <tr><td colSpan={5}>No data-rights requests yet.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h3>Compliance Action Register</h3>
        <div className="stack-list">
          {complianceTasks.map(([priority, task, status]) => (
            <div className="mini-row split-row" key={task}>
              <div>
                <StatusBadge status={priority} />
                <strong>{task}</strong>
              </div>
              <p className="muted">{status}</p>
            </div>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
