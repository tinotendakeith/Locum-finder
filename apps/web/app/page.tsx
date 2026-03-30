import Link from "next/link";
import { PublicHeader, PublicFooter } from "../components/public-layout";

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <section className="hero">
        <div className="container">
          <h1>Healthcare staffing workflows for clinics and locum professionals</h1>
          <p>
            Locum Finder is a verified healthcare staffing marketplace for temporary shifts, contracts,
            and placements. Built for trust, moderation, and operational staffing workflows.
          </p>
          <div className="hero-actions">
            <Link href="/register/locum" className="btn">I am a Locum</Link>
            <Link href="/register/clinic" className="btn secondary">I am a Clinic / Facility</Link>
            <Link href="/jobs" className="btn secondary">Browse Jobs</Link>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="grid-3">
          <article className="card"><h3>Verified Profiles</h3><p>Professional and facility verification with approval workflows.</p></article>
          <article className="card"><h3>Shift-Centric Listings</h3><p>One-day shifts, temporary cover, and medium-term placements.</p></article>
          <article className="card"><h3>Moderated Marketplace</h3><p>Admin controls for users, jobs, documents, and disputes.</p></article>
        </div>
      </section>
      <PublicFooter />
    </>
  );
}
