import Link from "next/link";
import { PublicFooter, PublicHeader } from "../../components/public-layout";
import { previewJobs } from "../../lib/preview-platform";

export default function JobsPage() {
  return (
    <>
      <PublicHeader />
      <main>
        <section className="page-hero">
          <div className="container page-head">
            <span className="eyebrow">Find work</span>
            <h1>Browse locum medical jobs</h1>
            <p>Search open shifts and contract placements across Zimbabwe. Apply when you are ready with a saved resume.</p>
          </div>
        </section>

        <section className="container section">
          <form className="toolbar">
            <div className="toolbar-grid">
              <input className="input" placeholder="Keyword or role" />
              <input className="input" placeholder="Location" />
              <select className="select" defaultValue="">
                <option value="" disabled>Specialty</option>
                <option>General Practice</option>
                <option>General Nursing</option>
                <option>Pharmacy</option>
                <option>Radiography</option>
              </select>
              <button className="btn" type="button">Search</button>
            </div>
          </form>

          <div className="jobs-grid">
            {previewJobs.map((job) => (
              <article key={job.id} className="job-card">
                <div className="job-card-top">
                  <span className="job-chip">{job.type}</span>
                  <span className="job-rate">{job.rate}</span>
                </div>
                <div className="job-card-body">
                  <h3>{job.title}</h3>
                  <p className="muted">{job.facility} - {job.city}</p>
                  <p>{job.summary}</p>
                </div>
                <div className="job-card-footer">
                  <div className="job-tags">
                    <span>{job.specialty}</span>
                    <span>{job.posted}</span>
                  </div>
                  <Link href={`/jobs/${job.id}`} className="btn secondary">View vacancy</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
