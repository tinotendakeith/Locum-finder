import { PublicFooter, PublicHeader } from "../../components/public-layout";

export default function ContactPage() {
  return (
    <>
      <PublicHeader />
      <main className="container section">
        <div className="page-head"><h1>Contact</h1><p>Platform support and partnership enquiries.</p></div>
        <form className="card form-grid">
          <input className="input" placeholder="Name" />
          <input className="input" placeholder="Email" />
          <textarea className="textarea" placeholder="Message" />
          <button className="btn">Send</button>
        </form>
      </main>
      <PublicFooter />
    </>
  );
}
