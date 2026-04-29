import Link from "next/link";
import { DashboardShell, StatusBadge } from "../../../../components/dashboard-shell";
import { getResumesForUser, requireUser, safeReturnTo } from "../../../../lib/local-auth";
import { locumMenu } from "../../../../lib/ui";

function valueOf(input: string | string[] | undefined) {
  return Array.isArray(input) ? (input[0] ?? "") : (input ?? "");
}

export default async function LocumProfilePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const user = await requireUser("locum", "/dashboard/locum/profile");
  const resumes = getResumesForUser(user.id);
  const returnTo = safeReturnTo(valueOf(params.returnTo), "");
  const onboarding = valueOf(params.onboarding) === "1";
  const saved = valueOf(params.saved) === "1";
  const defaulted = valueOf(params.defaulted) === "1";
  const error = valueOf(params.error) === "missing_resume_fields" ? "Please complete the required resume fields before saving." : "";
  const fullName = valueOf(params.fullName) || user.name;
  const profession = valueOf(params.profession) || "General Practitioner";

  return (
    <DashboardShell title="Locum Dashboard" menu={locumMenu} currentPath="/dashboard/locum/profile" accountName={user.name} accountEmail={user.email}>
      <div className="section-head">
        <div>
          <span className="eyebrow">Resume builder</span>
          <h2>Reusable locum resumes</h2>
        </div>
        {returnTo ? <Link href={returnTo} className="btn secondary">Back to vacancy</Link> : null}
      </div>

      {onboarding ? <p className="badge warning">Account created. Save your first resume to unlock fast applications.</p> : null}
      {saved ? <p className="badge success">Resume saved successfully.</p> : null}
      {defaulted ? <p className="badge success">Default resume updated.</p> : null}
      {error ? <p className="badge danger">{error}</p> : null}

      <div className="split-layout">
        <form className="card form-grid" action="/auth/resumes" method="post" encType="multipart/form-data">
          <h3>Create resume</h3>
          <div className="grid-2">
            <label>
              <span>Resume title</span>
              <input name="title" className="input" defaultValue="Primary Resume" required />
            </label>
            <label>
              <span>Full name</span>
              <input name="fullName" className="input" defaultValue={fullName} required />
            </label>
            <label>
              <span>Professional title</span>
              <input name="professionalTitle" className="input" defaultValue={profession} required />
            </label>
            <label>
              <span>Location</span>
              <input name="location" className="input" defaultValue="Harare" />
            </label>
          </div>
          <label>
            <span>Specialties</span>
            <input name="specialties" className="input" defaultValue="General Practice, Primary Care" />
          </label>
          <label>
            <span>About you</span>
            <textarea name="summary" className="textarea" defaultValue="Tell clinics about your background, strengths, and the kind of locum work you are looking for." />
          </label>
          <label>
            <span>Education</span>
            <textarea name="education" className="textarea" placeholder="Qualifications, institutions, dates." />
          </label>
          <label>
            <span>Experience</span>
            <textarea name="experience" className="textarea" placeholder="Roles, facilities, responsibilities, and years of experience." />
          </label>
          <div className="grid-2">
            <label>
              <span>Video URL</span>
              <input name="videoUrl" className="input" placeholder="Optional intro video link" />
            </label>
            <label>
              <span>Profile links</span>
              <input name="urls" className="input" placeholder="Portfolio, LinkedIn, website" />
            </label>
          </div>
          <div className="grid-2">
            <label>
              <span>Profile photo</span>
              <input name="profilePhoto" type="file" className="input" accept="image/*" />
            </label>
            <label>
              <span>Qualification certificate</span>
              <input name="qualificationCertificate" type="file" className="input" />
            </label>
          </div>
          <label>
            <span>Practicing certificate</span>
            <input name="practicingCertificate" type="file" className="input" />
          </label>
          <input type="hidden" name="returnTo" value={returnTo} />
          <button type="submit" className="btn">Save resume</button>
        </form>

        <div className="form-grid">
          {resumes.map((resume) => (
            <article key={resume.id} className="card">
              <div className="job-card-top">
                <div>
                  <h3>{resume.title}</h3>
                  <p className="muted">{resume.fullName} - {resume.professionalTitle}</p>
                </div>
                {resume.isDefault ? <StatusBadge status="DEFAULT" /> : null}
              </div>
              <p><strong>Location:</strong> {resume.location || "Not provided"}</p>
              <p><strong>Specialties:</strong> {resume.specialties || "Not provided"}</p>
              <p><strong>About:</strong> {resume.summary || "Not provided"}</p>
              <div className="hero-actions">
                {!resume.isDefault ? (
                  <form action="/auth/resumes/default" method="post">
                    <input type="hidden" name="resumeId" value={resume.id} />
                    <input type="hidden" name="returnTo" value={returnTo} />
                    <button type="submit" className="btn secondary">Set default</button>
                  </form>
                ) : null}
                {returnTo ? <Link href={returnTo} className="btn secondary">Use for vacancy</Link> : null}
              </div>
            </article>
          ))}
          {!resumes.length ? (
            <article className="card">
              <h3>No resumes yet</h3>
              <p className="muted">Save your first resume here, then return to a job and apply with it.</p>
            </article>
          ) : null}
        </div>
      </div>
    </DashboardShell>
  );
}
