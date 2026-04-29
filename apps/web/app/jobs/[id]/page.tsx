import Link from "next/link";
import { JobApplyPanel } from "../../../components/job-apply-panel";
import { PublicFooter, PublicHeader } from "../../../components/public-layout";
import { getPreviewJob } from "../../../lib/preview-platform";

function valueOf(input: string | string[] | undefined) {
  return Array.isArray(input) ? (input[0] ?? "") : (input ?? "");
}

export default async function JobDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const job = getPreviewJob(id);

  if (!job) {
    return (
      <>
        <PublicHeader />
        <main className="container section">
          <div className="page-head">
            <span className="eyebrow">Vacancy unavailable</span>
            <h1>That job is no longer listed</h1>
            <p className="muted">The vacancy may have been filled, closed, or removed from this preview dataset.</p>
          </div>
          <Link href="/jobs" className="btn">Back to jobs</Link>
        </main>
        <PublicFooter />
      </>
    );
  }

  return (
    <>
      <PublicHeader />
      <main>
        <section className="page-hero">
          <div className="container page-head">
            <span className="eyebrow">{job.type}</span>
            <h1>{job.title}</h1>
            <p>{job.facility} - {job.city} - {job.rate}</p>
          </div>
        </section>

        <section className="container section detail-layout">
          <article className="card">
            <div className="job-tags">
              <span>{job.specialty}</span>
              <span>{job.shiftDates}</span>
              <span>{job.posted}</span>
            </div>

            <h2>Vacancy details</h2>
            <p>{job.description}</p>

            <h3>Requirements</h3>
            <p>{job.requirements}</p>

            <h3>Responsibilities</h3>
            <ul className="detail-list">
              {job.responsibilities.map((item) => <li key={item}>{item}</li>)}
            </ul>

            <h3>How applying works</h3>
            <ul className="detail-list">
              <li>Create or log into a locum account.</li>
              <li>Build one or more reusable resumes.</li>
              <li>Select the resume that best matches this vacancy.</li>
              <li>Submit a short message for the clinic to review.</li>
            </ul>
          </article>

          <JobApplyPanel job={job} returnTo={`/jobs/${job.id}`} applied={valueOf(query.applied) === "1"} error={valueOf(query.error)} />
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
