export type PreviewRole = "locum" | "clinic" | "admin";

export type PreviewSession = {
  role: PreviewRole;
  email: string;
  name: string;
};

export type PreviewJob = {
  id: string;
  title: string;
  facility: string;
  city: string;
  rate: string;
  summary: string;
  type: string;
  specialty: string;
  posted: string;
  description: string;
  requirements: string;
  shiftDates: string;
  responsibilities: string[];
  clinicEmail: string;
};

export type PreviewResume = {
  id: string;
  userEmail: string;
  title: string;
  fullName: string;
  professionalTitle: string;
  location: string;
  specialties: string;
  summary: string;
  isDefault: boolean;
  updatedAt: string;
};

export type PreviewApplicationStatus = "SUBMITTED" | "UNDER_REVIEW" | "SHORTLISTED" | "APPROVED" | "REJECTED";

export type PreviewApplication = {
  id: string;
  jobId: string;
  jobTitle: string;
  facilityName: string;
  clinicEmail: string;
  applicantEmail: string;
  applicantName: string;
  resumeId: string;
  resumeTitle: string;
  message: string;
  status: PreviewApplicationStatus;
  appliedAt: string;
};

const SESSION_KEY = "locumfinder.preview.session";
const RESUME_KEY = "locumfinder.preview.resumes";
const APPLICATION_KEY = "locumfinder.preview.applications";

export const previewJobs: PreviewJob[] = [
  {
    id: "job-1",
    title: "Weekend GP Cover",
    facility: "Central Care Clinic",
    city: "Harare",
    rate: "USD 45/hr",
    summary: "Two-day weekend cover for a busy outpatient clinic with walk-ins and continuity handovers.",
    type: "Weekend Shift",
    specialty: "General Practice",
    posted: "Closes in 2 days",
    description: "Central Care Clinic needs weekend GP cover for a busy outpatient team with urgent walk-ins and continuity handovers.",
    requirements: "Registered practitioner license, recent GP experience, and strong triage confidence.",
    shiftDates: "Saturday and Sunday, 08:00 - 17:00",
    responsibilities: ["Outpatient consultations", "Urgent primary care triage", "Safe handover to weekday team"],
    clinicEmail: "clinic@locumfinder.test",
  },
  {
    id: "job-2",
    title: "Theatre Nurse Locum",
    facility: "Westside Hospital",
    city: "Bulawayo",
    rate: "USD 38/hr",
    summary: "Short-term theatre support for elective and urgent procedures in an active surgical rota.",
    type: "Short Contract",
    specialty: "Surgical Nursing",
    posted: "Closes in 4 days",
    description: "Westside Hospital is covering annual leave and needs a theatre nurse locum who can slot into an active surgical rota.",
    requirements: "Scrub experience, peri-operative coordination, and theatre safety documentation.",
    shiftDates: "5-day contract, day shifts",
    responsibilities: ["Support theatre prep", "Maintain sterile workflow", "Coordinate post-op handover"],
    clinicEmail: "westside@locumfinder.test",
  },
  {
    id: "job-3",
    title: "Pharmacy Relief Shift",
    facility: "Morningside Medical Centre",
    city: "Harare",
    rate: "USD 32/hr",
    summary: "Urgent dispensing and pharmacy support for a high-volume outpatient unit.",
    type: "Urgent Cover",
    specialty: "Pharmacy",
    posted: "Closes tomorrow",
    description: "Morningside Medical Centre needs short-notice pharmacy support during a high-volume outpatient period.",
    requirements: "Dispensing experience, stock handling, and patient counselling confidence.",
    shiftDates: "Single urgent relief shift",
    responsibilities: ["Dispense scripts", "Check stock issues", "Support patient advice desk"],
    clinicEmail: "morningside@locumfinder.test",
  },
  {
    id: "job-4",
    title: "Radiographer Locum",
    facility: "Cimas Diagnostic Unit",
    city: "Mutare",
    rate: "USD 41/hr",
    summary: "Imaging support for a regional diagnostic team during staff leave coverage.",
    type: "Temporary Placement",
    specialty: "Radiography",
    posted: "Closes in 5 days",
    description: "A regional diagnostic team needs additional imaging support during staff leave cover.",
    requirements: "General radiography competence, patient positioning, and imaging workflow discipline.",
    shiftDates: "Two-week placement",
    responsibilities: ["Run imaging sessions", "Maintain imaging logs", "Support reporting workflow"],
    clinicEmail: "cimas@locumfinder.test",
  },
  {
    id: "job-5",
    title: "Emergency Doctor Night Cover",
    facility: "Cityline Hospital",
    city: "Bulawayo",
    rate: "USD 55/hr",
    summary: "Night emergency cover with trauma triage and inpatient handover responsibilities.",
    type: "Night Shift",
    specialty: "Emergency Medicine",
    posted: "Closes in 3 days",
    description: "Cityline Hospital needs an experienced emergency doctor for night cover and acute presentations.",
    requirements: "Emergency room confidence, trauma triage, and inpatient escalation experience.",
    shiftDates: "Three consecutive night shifts",
    responsibilities: ["Lead emergency triage", "Stabilize acute cases", "Coordinate inpatient handover"],
    clinicEmail: "cityline@locumfinder.test",
  },
  {
    id: "job-6",
    title: "Ward Nurse Weekend Relief",
    facility: "Greenfields Clinic",
    city: "Gweru",
    rate: "USD 29/hr",
    summary: "Weekend ward support for a mixed adult inpatient team.",
    type: "Weekend Shift",
    specialty: "General Nursing",
    posted: "Closes in 6 days",
    description: "Greenfields Clinic needs weekend ward nursing cover for a mixed adult inpatient unit.",
    requirements: "Ward nursing experience, medication administration, and clear patient notes.",
    shiftDates: "Weekend day shifts",
    responsibilities: ["Ward rounds support", "Medication administration", "Patient chart updates"],
    clinicEmail: "greenfields@locumfinder.test",
  },
];

function hasWindow() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!hasWindow()) return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!hasWindow()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function slugName(email: string) {
  const local = email.split("@")[0] ?? "locum";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getPreviewJob(jobId: string) {
  return previewJobs.find((job) => job.id === jobId);
}

export function getSession() {
  return readJson<PreviewSession | null>(SESSION_KEY, null);
}

export function setSession(session: PreviewSession) {
  writeJson(SESSION_KEY, session);
}

export function clearSession() {
  if (!hasWindow()) return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function loginPreview(role: PreviewRole, email: string, name?: string) {
  const session = {
    role,
    email,
    name: name?.trim() || slugName(email),
  } satisfies PreviewSession;
  setSession(session);
  return session;
}

export function getResumes(userEmail?: string) {
  const session = getSession();
  const email = userEmail ?? session?.email;
  if (!email) return [] as PreviewResume[];
  return readJson<PreviewResume[]>(RESUME_KEY, []).filter((resume) => resume.userEmail === email);
}

export function createResume(input: Omit<PreviewResume, "id" | "updatedAt">) {
  const resumes = readJson<PreviewResume[]>(RESUME_KEY, []);
  const next = input.isDefault
    ? resumes.map((resume) => (resume.userEmail === input.userEmail ? { ...resume, isDefault: false } : resume))
    : resumes;
  const created: PreviewResume = {
    ...input,
    id: `resume-${Date.now()}`,
    updatedAt: new Date().toISOString(),
  };
  writeJson(RESUME_KEY, [...next, created]);
  return created;
}

export function setDefaultResume(userEmail: string, resumeId: string) {
  const resumes = readJson<PreviewResume[]>(RESUME_KEY, []).map((resume) =>
    resume.userEmail === userEmail ? { ...resume, isDefault: resume.id === resumeId } : resume,
  );
  writeJson(RESUME_KEY, resumes);
}

export function getApplications() {
  return readJson<PreviewApplication[]>(APPLICATION_KEY, []);
}

export function getApplicationsForLocum(email: string) {
  return getApplications().filter((application) => application.applicantEmail === email);
}

export function getApplicationsForClinic(email: string) {
  return getApplications().filter((application) => application.clinicEmail === email);
}

export function applyToJob(input: {
  applicantEmail: string;
  applicantName: string;
  jobId: string;
  resumeId: string;
  message: string;
}) {
  const job = getPreviewJob(input.jobId);
  if (!job) {
    return { ok: false as const, error: "This vacancy could not be found." };
  }

  const resumes = getResumes(input.applicantEmail);
  const resume = resumes.find((item) => item.id === input.resumeId);
  if (!resume) {
    return { ok: false as const, error: "Select a valid resume before applying." };
  }

  const applications = getApplications();
  const existing = applications.find(
    (application) => application.jobId === input.jobId && application.applicantEmail === input.applicantEmail,
  );
  if (existing) {
    return { ok: false as const, error: "You have already applied to this vacancy." };
  }

  const created: PreviewApplication = {
    id: `application-${Date.now()}`,
    jobId: job.id,
    jobTitle: job.title,
    facilityName: job.facility,
    clinicEmail: job.clinicEmail,
    applicantEmail: input.applicantEmail,
    applicantName: input.applicantName,
    resumeId: resume.id,
    resumeTitle: resume.title,
    message: input.message,
    status: "SUBMITTED",
    appliedAt: new Date().toISOString(),
  };

  writeJson(APPLICATION_KEY, [created, ...applications]);
  return { ok: true as const, application: created };
}

export function dashboardPathForRole(role: PreviewRole) {
  if (role === "clinic") return "/dashboard/clinic";
  if (role === "admin") return "/admin";
  return "/dashboard/locum";
}
