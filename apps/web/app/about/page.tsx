import { PublicFooter, PublicHeader } from "../../components/public-layout";

export default function AboutPage() {
  return (
    <>
      <PublicHeader />
      <main className="container section">
        <div className="page-head"><h1>About Locum Finder</h1><p>Purpose-built healthcare staffing platform.</p></div>
        <article className="card">
          <p>Locum Finder connects verified clinics and verified locum professionals for safe, fast staffing.</p>
          <p>This rebuild replaces a limited WordPress model with a scalable API-first architecture.</p>
        </article>
      </main>
      <PublicFooter />
    </>
  );
}
