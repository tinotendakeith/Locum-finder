import { PublicFooter, PublicHeader } from "../../../components/public-layout";

export default function RegisterClinicPage() {
  return (
    <>
      <PublicHeader />
      <main className="container section">
        <div className="page-head"><h1>Clinic Registration</h1><p>Create your organization account.</p></div>
        <form className="card form-grid">
          <input className="input" placeholder="Facility name" />
          <input className="input" placeholder="Contact person" />
          <input className="input" placeholder="Email" />
          <input className="input" placeholder="Phone" />
          <input className="input" type="password" placeholder="Password" />
          <button className="btn">Create clinic account</button>
        </form>
      </main>
      <PublicFooter />
    </>
  );
}
