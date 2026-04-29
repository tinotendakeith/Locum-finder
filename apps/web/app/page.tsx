import Link from "next/link";
import { PublicFooter, PublicHeader } from "../components/public-layout";
import { previewJobs } from "../lib/preview-platform";

const professions = ["Doctors", "Nurses", "Pharmacists", "Radiographers"];

export default function HomePage() {
  const featuredJobs = previewJobs.slice(0, 3);

  return (
    <>
      <PublicHeader />
      <main>
        <section className="hero-home">
          <div className="container hero-inner">
            <div className="hero-copy">
              <h1>Zimbabwe's #1 Platform for Locum Medical Jobs and Staffing</h1>
              <p>
                Connect clinics and hospitals with qualified locum medical professionals from around Zimbabwe in minutes.
                Post jobs, list your availability, and work with confidence.
              </p>
              <div className="hero-actions">
                <Link href="/register/clinic" className="btn">Post a Locum Vacancy</Link>
                <Link href="/jobs" className="btn">Find Work</Link>
              </div>
            </div>

            <form className="search-panel">
              <span className="eyebrow">Quick search</span>
              <h2>Search for locums or jobs</h2>
              <div className="search-grid">
                <input className="input" placeholder="Role, skill, or keyword" />
                <select className="select" defaultValue="">
                  <option value="" disabled>Profession</option>
                  {professions.map((profession) => <option key={profession}>{profession}</option>)}
                </select>
                <input className="input" placeholder="City or province" />
                <Link href="/jobs" className="btn">Search Jobs</Link>
              </div>
            </form>
          </div>
        </section>

        <section className="section alt">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Marketplace workflow</span>
                <h2>Built for urgent medical staffing</h2>
              </div>
              <p>Locums browse first, apply with a saved resume, and clinics manage every applicant from one dashboard.</p>
            </div>
            <div className="grid-3">
              <article className="card">
                <h3>Browse vacancies</h3>
                <p>Search by role, location, specialty, urgency, and shift type before creating an account.</p>
              </article>
              <article className="card">
                <h3>Apply with resumes</h3>
                <p>Locums keep multiple resumes ready and choose the right one for each clinical opportunity.</p>
              </article>
              <article className="card">
                <h3>Hire from one place</h3>
                <p>Clinics post jobs, review candidates, shortlist applicants, and keep a clear hiring record.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Featured vacancies</span>
                <h2>Current locum opportunities</h2>
              </div>
              <Link href="/jobs" className="btn secondary">View all jobs</Link>
            </div>
            <div className="jobs-grid">
              {featuredJobs.map((job) => (
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
                    <Link href={`/jobs/${job.id}`} className="btn secondary">View</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section alt">
          <div className="container stat-strip">
            <div className="stat"><strong>3</strong><span>role types</span></div>
            <div className="stat"><strong>6</strong><span>sample vacancies</span></div>
            <div className="stat"><strong>24h</strong><span>urgent cover flow</span></div>
            <div className="stat"><strong>1</strong><span>admin approval layer</span></div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
