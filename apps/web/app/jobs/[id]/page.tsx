import Link from "next/link";
import { PublicFooter, PublicHeader } from "../../../components/public-layout";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <PublicHeader />
      <main className="container section">
        <div className="page-head"><h1>Job Detail: {params.id}</h1><p>Verified opportunity listing.</p></div>
        <article className="card">
          <h3>Weekend GP Cover</h3>
          <p>Facility: Central Care Clinic, Harare</p>
          <p>Shift dates: Saturday and Sunday, 08:00 - 17:00</p>
          <p>Requirements: Registered practitioner license, emergency triage experience.</p>
          <div className="hero-actions">
            <Link href="/login" className="btn">Apply Now</Link>
            <Link href="/jobs" className="btn secondary">Back to jobs</Link>
          </div>
        </article>
      </main>
      <PublicFooter />
    </>
  );
}
