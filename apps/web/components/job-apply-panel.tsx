import Link from "next/link";
import { getCurrentUser, getResumesForUser, safeReturnTo } from "../lib/local-auth";
import type { PreviewJob } from "../lib/preview-platform";

type Props = {
  job: PreviewJob;
  returnTo?: string;
  applied?: boolean;
  error?: string;
};

function errorMessage(code: string) {
  if (code === "locum_only") return "Only locum accounts can apply to vacancies.";
  if (code === "resume_required") return "Select a valid resume before applying.";
  if (code === "duplicate_application") return "You have already applied to this vacancy.";
  if (code === "job_not_found") return "This vacancy could not be found.";
  return "";
}

export async function JobApplyPanel({ job, returnTo, applied, error }: Props) {
  const user = await getCurrentUser();
  const target = safeReturnTo(returnTo, `/jobs/${job.id}`);

  if (!user) {
    return <div className="card apply-panel"><span className="eyebrow">Fast apply</span><h3>Ready to apply?</h3><p>Applications are resume-based. Log in first, then choose which saved resume to use.</p><div className="hero-actions"><Link href={`/login?returnTo=${encodeURIComponent(target)}`} className="btn">Login to Apply</Link><Link href={`/register/locum?returnTo=${encodeURIComponent(target)}`} className="btn secondary">Create account</Link></div></div>;
  }

  if (user.role !== "locum") {
    return <div className="card apply-panel"><span className="eyebrow">Account type</span><h3>Locum access required</h3><p>You are logged in as a {user.role}. Only locum accounts can apply to vacancies.</p><div className="hero-actions"><Link href="/login" className="btn secondary">Switch account</Link></div></div>;
  }

  const resumes = getResumesForUser(user.id);
  if (!resumes.length) {
    return <div className="card apply-panel"><span className="eyebrow">Resume required</span><h3>Create a resume first</h3><p>You are logged in as {user.name}, but you need at least one saved resume before you can apply.</p><div className="hero-actions"><Link href={`/dashboard/locum/profile?onboarding=1&returnTo=${encodeURIComponent(target)}`} className="btn">Create resume</Link></div></div>;
  }

  const defaultResumeId = resumes.find((resume) => resume.isDefault)?.id ?? resumes[0]?.id ?? "";

  return (
    <div className="card apply-panel">
      <span className="eyebrow">Apply now</span>
      <h3>Apply with a saved resume</h3>
      <p>Logged in as {user.name}. Choose one resume, add a short message, and submit.</p>
      {applied ? <p className="badge success">Application submitted</p> : null}
      {errorMessage(error ?? "") ? <p className="badge danger">{errorMessage(error ?? "")}</p> : null}
      <form className="apply-form" action="/auth/apply" method="post">
        <input type="hidden" name="jobId" value={job.id} />
        <input type="hidden" name="returnTo" value={target} />
        <label><span>Select resume</span><select className="select" name="resumeId" defaultValue={defaultResumeId}>{resumes.map((resume) => <option key={resume.id} value={resume.id}>{resume.title}{resume.isDefault ? " (Default)" : ""}</option>)}</select></label>
        <label><span>Message to clinic</span><textarea className="textarea" name="message" defaultValue={`I am available for ${job.title.toLowerCase()} and can provide prompt cover.`} /></label>
        <button type="submit" className="btn">Submit application</button>
      </form>
      {applied ? <div className="hero-actions"><Link href="/dashboard/locum/applications" className="btn secondary">View my applications</Link><Link href="/dashboard/clinic/applicants" className="btn secondary">Preview clinic applicants</Link></div> : null}
    </div>
  );
}
