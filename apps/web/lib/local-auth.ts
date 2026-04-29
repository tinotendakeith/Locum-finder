import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getPreviewJob } from "./preview-platform";

export type AppRole = "locum" | "clinic" | "admin";

export type SessionUser = {
  id: string;
  role: AppRole;
  email: string;
  name: string;
};

export type PrivacyConsent = {
  acceptedPrivacyNotice: boolean;
  acceptedSensitiveDataUse: boolean;
  marketingOptIn: boolean;
  consentedAt: string;
  consentVersion: string;
};

export type PrivacyPreferences = {
  accountEmail: boolean;
  jobAlerts: boolean;
  smsNotifications: boolean;
  marketingMessages: boolean;
  updatedAt: string;
};

export type DataRightsRequest = {
  id: string;
  accountId: string | null;
  name: string;
  email: string;
  requestType: "access" | "correction" | "deletion" | "objection" | "export";
  details: string;
  status: "OPEN" | "IN_REVIEW" | "COMPLETED";
  createdAt: string;
};

type StoredAccount = SessionUser & {
  passwordHash: string;
  createdAt: string;
  privacyConsent?: PrivacyConsent;
  privacyPreferences?: PrivacyPreferences;
};

type StoredSession = {
  token: string;
  accountId: string;
  createdAt: string;
};

export type StoredResume = {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  fullName: string;
  professionalTitle: string;
  location: string;
  specialties: string;
  summary: string;
  videoUrl: string;
  urls: string;
  education: string;
  experience: string;
  photoFileName: string;
  qualificationCertificateFileName: string;
  practicingCertificateFileName: string;
  isDefault: boolean;
  updatedAt: string;
};

export type StoredApplicationStatus = "SUBMITTED" | "UNDER_REVIEW" | "SHORTLISTED" | "APPROVED" | "REJECTED";

export type StoredApplication = {
  id: string;
  jobId: string;
  jobTitle: string;
  facilityName: string;
  clinicEmail: string;
  applicantUserId: string;
  applicantEmail: string;
  applicantName: string;
  resumeId: string;
  resumeTitle: string;
  message: string;
  status: StoredApplicationStatus;
  appliedAt: string;
};

export type StoredClinicProfile = {
  userId: string;
  facilityName: string;
  organizationType: string;
  description: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  contactPerson: string;
  updatedAt: string;
};

type StoreData = {
  accounts: StoredAccount[];
  sessions: StoredSession[];
  resumes: StoredResume[];
  applications: StoredApplication[];
  clinicProfiles: StoredClinicProfile[];
  dataRightsRequests?: DataRightsRequest[];
};

export const SESSION_COOKIE = "locumfinder_session";
const DATA_FILE = join(process.cwd(), ".data", "local-auth.json");

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function seedStore(): StoreData {
  const demoPassword = hashPassword("demo-password");
  const now = new Date().toISOString();

  const locum: StoredAccount = {
    id: "acct-demo-locum",
    role: "locum",
    email: "locum@locumfinder.test",
    name: "Demo Locum",
    passwordHash: demoPassword,
    createdAt: now,
  };

  const clinic: StoredAccount = {
    id: "acct-demo-clinic",
    role: "clinic",
    email: "clinic@locumfinder.test",
    name: "Central Care Clinic",
    passwordHash: demoPassword,
    createdAt: now,
  };

  const admin: StoredAccount = {
    id: "acct-demo-admin",
    role: "admin",
    email: "admin@locumfinder.test",
    name: "Platform Admin",
    passwordHash: demoPassword,
    createdAt: now,
  };

  const resume: StoredResume = {
    id: "resume-demo-locum",
    userId: locum.id,
    userEmail: locum.email,
    title: "General Practice Resume",
    fullName: locum.name,
    professionalTitle: "General Practitioner",
    location: "Harare",
    specialties: "General Practice, Primary Care",
    summary: "Available for urgent cover, weekend shifts, and short-term clinic placements.",
    videoUrl: "",
    urls: "",
    education: "University of Zimbabwe - MBChB",
    experience: "Weekend clinic cover and outpatient consultations",
    photoFileName: "",
    qualificationCertificateFileName: "",
    practicingCertificateFileName: "",
    isDefault: true,
    updatedAt: now,
  };

  const clinicProfile: StoredClinicProfile = {
    userId: clinic.id,
    facilityName: clinic.name,
    organizationType: "clinic",
    description: "Outpatient clinic with urgent care and weekend locum cover needs.",
    city: "Harare",
    phone: "+263 77 000 0000",
    email: clinic.email,
    website: "https://centralcare.example",
    contactPerson: "Operations Manager",
    updatedAt: now,
  };

  const application: StoredApplication = {
    id: "application-demo-1",
    jobId: "job-1",
    jobTitle: "Weekend GP Cover",
    facilityName: "Central Care Clinic",
    clinicEmail: clinic.email,
    applicantUserId: locum.id,
    applicantEmail: locum.email,
    applicantName: locum.name,
    resumeId: resume.id,
    resumeTitle: resume.title,
    message: "I am available this weekend and can provide fast cover.",
    status: "UNDER_REVIEW",
    appliedAt: now,
  };

  return {
    accounts: [locum, clinic, admin],
    sessions: [],
    resumes: [resume],
    applications: [application],
    clinicProfiles: [clinicProfile],
  };
}

function ensureStore() {
  if (!existsSync(DATA_FILE)) {
    mkdirSync(join(process.cwd(), ".data"), { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify(seedStore(), null, 2), "utf8");
  }
}

function readStore() {
  ensureStore();
  return JSON.parse(readFileSync(DATA_FILE, "utf8")) as StoreData;
}

function writeStore(store: StoreData) {
  ensureStore();
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

function defaultPrivacyPreferences(marketingOptIn = false): PrivacyPreferences {
  return {
    accountEmail: true,
    jobAlerts: true,
    smsNotifications: true,
    marketingMessages: marketingOptIn,
    updatedAt: new Date().toISOString(),
  };
}

function buildPrivacyConsent(input: {
  acceptedPrivacyNotice: boolean;
  acceptedSensitiveDataUse: boolean;
  marketingOptIn: boolean;
}): PrivacyConsent {
  return {
    acceptedPrivacyNotice: input.acceptedPrivacyNotice,
    acceptedSensitiveDataUse: input.acceptedSensitiveDataUse,
    marketingOptIn: input.marketingOptIn,
    consentedAt: new Date().toISOString(),
    consentVersion: "cdpa-si155-2026-04",
  };
}

export function dashboardPathForRole(role: AppRole) {
  if (role === "clinic") return "/dashboard/clinic";
  if (role === "admin") return "/admin";
  return "/dashboard/locum";
}

export function safeReturnTo(value: string | null | undefined, fallback: string) {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  return value;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const store = readStore();
  const session = store.sessions.find((item) => item.token === token);
  if (!session) return null;

  const account = store.accounts.find((item) => item.id === session.accountId);
  if (!account) return null;

  return {
    id: account.id,
    role: account.role,
    email: account.email,
    name: account.name,
  };
}

export async function requireUser(role: AppRole | null, returnTo: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  if (role && user.role !== role) {
    redirect(dashboardPathForRole(user.role));
  }

  return user;
}

export function authenticateAccount(input: { role: AppRole; email: string; password: string }) {
  const store = readStore();
  const email = normalizeEmail(input.email);
  const account = store.accounts.find((item) => item.email === email);
  if (!account) return { ok: false as const, error: "invalid_credentials" };
  if (account.role !== input.role) return { ok: false as const, error: "wrong_role" };
  if (!verifyPassword(input.password, account.passwordHash)) return { ok: false as const, error: "invalid_credentials" };
  return { ok: true as const, account };
}

export function createSession(accountId: string) {
  const store = readStore();
  const token = randomUUID();
  store.sessions = store.sessions.filter((item) => item.accountId !== accountId);
  store.sessions.push({ token, accountId, createdAt: new Date().toISOString() });
  writeStore(store);
  return token;
}

export function destroySession(token: string | undefined) {
  if (!token) return;
  const store = readStore();
  const next = store.sessions.filter((item) => item.token !== token);
  if (next.length !== store.sessions.length) {
    store.sessions = next;
    writeStore(store);
  }
}

export function registerLocumAccount(input: {
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
  phone: string;
  password: string;
  acceptedPrivacyNotice: boolean;
  acceptedSensitiveDataUse: boolean;
  marketingOptIn: boolean;
}) {
  const store = readStore();
  const email = normalizeEmail(input.email);
  if (store.accounts.some((item) => item.email === email)) return { ok: false as const, error: "email_exists" };

  const name = `${input.firstName.trim()} ${input.lastName.trim()}`.trim();
  const account: StoredAccount = {
    id: randomUUID(),
    role: "locum",
    email,
    name: name || "New Locum",
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
    privacyConsent: buildPrivacyConsent(input),
    privacyPreferences: defaultPrivacyPreferences(input.marketingOptIn),
  };

  store.accounts.push(account);
  writeStore(store);
  return { ok: true as const, account, onboarding: { fullName: account.name, profession: input.profession.trim(), phone: input.phone.trim() } };
}

export function registerClinicAccount(input: {
  facilityName: string;
  contactPerson: string;
  email: string;
  phone: string;
  password: string;
  acceptedPrivacyNotice: boolean;
  acceptedSensitiveDataUse: boolean;
  marketingOptIn: boolean;
}) {
  const store = readStore();
  const email = normalizeEmail(input.email);
  if (store.accounts.some((item) => item.email === email)) return { ok: false as const, error: "email_exists" };

  const account: StoredAccount = {
    id: randomUUID(),
    role: "clinic",
    email,
    name: input.facilityName.trim() || "New Clinic",
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
    privacyConsent: buildPrivacyConsent(input),
    privacyPreferences: defaultPrivacyPreferences(input.marketingOptIn),
  };

  const profile: StoredClinicProfile = {
    userId: account.id,
    facilityName: input.facilityName.trim(),
    organizationType: "clinic",
    description: "",
    city: "",
    phone: input.phone.trim(),
    email,
    website: "",
    contactPerson: input.contactPerson.trim(),
    updatedAt: new Date().toISOString(),
  };

  store.accounts.push(account);
  store.clinicProfiles = store.clinicProfiles.filter((item) => item.userId !== account.id);
  store.clinicProfiles.push(profile);
  writeStore(store);
  return { ok: true as const, account };
}

export function getPrivacyPreferences(userId: string) {
  const store = readStore();
  const account = store.accounts.find((item) => item.id === userId);
  return account?.privacyPreferences ?? defaultPrivacyPreferences(account?.privacyConsent?.marketingOptIn ?? false);
}

export function updatePrivacyPreferences(userId: string, input: Omit<PrivacyPreferences, "updatedAt">) {
  const store = readStore();
  const account = store.accounts.find((item) => item.id === userId);
  if (!account) return null;

  account.privacyPreferences = { ...input, updatedAt: new Date().toISOString() };
  writeStore(store);
  return account.privacyPreferences;
}

export function createDataRightsRequest(input: {
  accountId?: string | null;
  name: string;
  email: string;
  requestType: DataRightsRequest["requestType"];
  details: string;
}) {
  const store = readStore();
  const created: DataRightsRequest = {
    id: randomUUID(),
    accountId: input.accountId ?? null,
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    requestType: input.requestType,
    details: input.details.trim(),
    status: "OPEN",
    createdAt: new Date().toISOString(),
  };

  store.dataRightsRequests = [created, ...(store.dataRightsRequests ?? [])];
  writeStore(store);
  return created;
}

export function getDataRightsRequests() {
  const store = readStore();
  return [...(store.dataRightsRequests ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getClinicProfile(userId: string) {
  const store = readStore();
  return store.clinicProfiles.find((item) => item.userId === userId) ?? null;
}

export function updateClinicProfile(userId: string, input: Omit<StoredClinicProfile, "userId" | "updatedAt">) {
  const store = readStore();
  const next: StoredClinicProfile = { userId, ...input, updatedAt: new Date().toISOString() };
  store.clinicProfiles = store.clinicProfiles.filter((item) => item.userId !== userId);
  store.clinicProfiles.push(next);
  writeStore(store);
  return next;
}

export function getResumesForUser(userId: string) {
  const store = readStore();
  return store.resumes
    .filter((item) => item.userId === userId)
    .sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || b.updatedAt.localeCompare(a.updatedAt));
}

export function createResumeForUser(
  user: SessionUser,
  input: Omit<StoredResume, "id" | "userId" | "userEmail" | "updatedAt" | "isDefault">,
) {
  const store = readStore();
  const existing = store.resumes.filter((item) => item.userId === user.id);
  const created: StoredResume = {
    id: randomUUID(),
    userId: user.id,
    userEmail: user.email,
    title: input.title.trim(),
    fullName: input.fullName.trim(),
    professionalTitle: input.professionalTitle.trim(),
    location: input.location.trim(),
    specialties: input.specialties.trim(),
    summary: input.summary.trim(),
    videoUrl: input.videoUrl.trim(),
    urls: input.urls.trim(),
    education: input.education.trim(),
    experience: input.experience.trim(),
    photoFileName: input.photoFileName.trim(),
    qualificationCertificateFileName: input.qualificationCertificateFileName.trim(),
    practicingCertificateFileName: input.practicingCertificateFileName.trim(),
    isDefault: existing.length === 0,
    updatedAt: new Date().toISOString(),
  };
  store.resumes.push(created);
  writeStore(store);
  return created;
}

export function setDefaultResumeForUser(userId: string, resumeId: string) {
  const store = readStore();
  let changed = false;
  store.resumes = store.resumes.map((resume) => {
    if (resume.userId !== userId) return resume;
    const isDefault = resume.id === resumeId;
    if (resume.isDefault !== isDefault) changed = true;
    return { ...resume, isDefault, updatedAt: isDefault ? new Date().toISOString() : resume.updatedAt };
  });
  if (changed) writeStore(store);
}

export function getApplicationsForLocum(userId: string) {
  const store = readStore();
  return store.applications.filter((item) => item.applicantUserId === userId).sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));
}

export function getApplicationsForClinic(email: string) {
  const store = readStore();
  return store.applications.filter((item) => item.clinicEmail === normalizeEmail(email)).sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));
}

export function createApplicationForUser(user: SessionUser, input: { jobId: string; resumeId: string; message: string }) {
  const store = readStore();
  const job = getPreviewJob(input.jobId);
  if (!job) return { ok: false as const, error: "job_not_found" };

  const resume = store.resumes.find((item) => item.id === input.resumeId && item.userId === user.id);
  if (!resume) return { ok: false as const, error: "resume_required" };

  const alreadyApplied = store.applications.some((item) => item.jobId === input.jobId && item.applicantUserId === user.id);
  if (alreadyApplied) return { ok: false as const, error: "duplicate_application" };

  const created: StoredApplication = {
    id: randomUUID(),
    jobId: job.id,
    jobTitle: job.title,
    facilityName: job.facility,
    clinicEmail: normalizeEmail(job.clinicEmail),
    applicantUserId: user.id,
    applicantEmail: user.email,
    applicantName: user.name,
    resumeId: resume.id,
    resumeTitle: resume.title,
    message: input.message.trim(),
    status: "SUBMITTED",
    appliedAt: new Date().toISOString(),
  };

  store.applications.unshift(created);
  writeStore(store);
  return { ok: true as const, application: created };
}
