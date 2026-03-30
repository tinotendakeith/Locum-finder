import Link from "next/link";
import { PublicFooter, PublicHeader } from "../../components/public-layout";

const jobs = [
  { id: "job-1", title: "Weekend GP Cover", facility: "Central Care Clinic", city: "Harare", rate: "USD 45/hr", status: "ACTIVE" },
  { id: "job-2", title: "Theatre Nurse Locum", facility: "Westside Hospital", city: "Bulawayo", rate: "USD 38/hr", status: "ACTIVE" },
];

export default function JobsPage() {
  return (
    <>
      <PublicHeader />
      <main className="container section">
        <div className="page-head"><h1>Browse Opportunities</h1><p>Search temporary shifts and locum placements.</p></div>
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="form-grid" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
            <input className="input" placeholder="Profession" />
            <input className="input" placeholder="Specialty" />
            <input className="input" placeholder="Location" />
            <button className="btn">Filter</button>
          </div>
        </div>
        <table className="table">
          <thead><tr><th>Title</th><th>Facility</th><th>City</th><th>Rate</th><th></th></tr></thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td><td>{job.facility}</td><td>{job.city}</td><td>{job.rate}</td>
                <td><Link href={`/jobs/${job.id}`} className="btn secondary">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <PublicFooter />
    </>
  );
}
