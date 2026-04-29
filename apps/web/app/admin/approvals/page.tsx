import { DashboardShell, StatusBadge } from "../../../components/dashboard-shell";
import { adminMenu } from "../../../lib/ui";

const approvals = [
  ["Locum profile", "Tariro Moyo", "SUBMITTED"],
  ["Clinic profile", "Westside Hospital", "PENDING"],
  ["Job listing", "Emergency Doctor Night Cover", "UNDER_REVIEW"],
  ["Document", "Practicing certificate", "PENDING"],
];

export default function AdminApprovalsPage() {
  return (
    <DashboardShell title="Admin Console" menu={adminMenu} currentPath="/admin/approvals">
      <div className="section-head"><div><span className="eyebrow">Review queue</span><h2>Approvals</h2></div></div>
      <div className="grid-2">
        {approvals.map(([type, item, status]) => (
          <article className="card" key={`${type}-${item}`}>
            <span className="eyebrow">{type}</span>
            <h3>{item}</h3>
            <p>Status: <StatusBadge status={status} /></p>
            <div className="hero-actions"><button className="btn" type="button">Approve</button><button className="btn secondary" type="button">Request changes</button></div>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
