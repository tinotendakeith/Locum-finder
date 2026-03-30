import { PublicFooter, PublicHeader } from "../../../components/public-layout";

export default function RegisterLocumPage() {
  return (
    <>
      <PublicHeader />
      <main className="container section">
        <div className="page-head"><h1>Locum Registration</h1><p>Create your healthcare professional account.</p></div>
        <form className="card form-grid">
          <input className="input" placeholder="First name" />
          <input className="input" placeholder="Last name" />
          <input className="input" placeholder="Email" />
          <input className="input" placeholder="Profession" />
          <input className="input" type="password" placeholder="Password" />
          <button className="btn">Create account</button>
        </form>
      </main>
      <PublicFooter />
    </>
  );
}
