export type StatusTone = "success" | "warning" | "danger" | "neutral" | "info";

export function statusTone(value: string): StatusTone {
  const v = value.toLowerCase();
  if (["active", "approved", "accepted", "filled"].includes(v)) return "success";
  if (["pending", "submitted", "under_review", "under review", "shortlisted"].includes(v)) return "warning";
  if (["rejected", "suspended", "cancelled", "closed", "expired"].includes(v)) return "danger";
  if (["draft"].includes(v)) return "neutral";
  return "info";
}

export const locumMenu = [
  { href: "/dashboard/locum", label: "Overview" },
  { href: "/dashboard/locum/profile", label: "Resumes" },
  { href: "/dashboard/locum/documents", label: "Documents" },
  { href: "/dashboard/locum/applications", label: "Applications" },
  { href: "/dashboard/locum/saved-jobs", label: "Saved Jobs" },
  { href: "/dashboard/locum/notifications", label: "Notifications" },
  { href: "/dashboard/locum/settings", label: "Settings" },
];

export const clinicMenu = [
  { href: "/dashboard/clinic", label: "Overview" },
  { href: "/dashboard/clinic/profile", label: "Profile" },
  { href: "/dashboard/clinic/jobs", label: "Jobs" },
  { href: "/dashboard/clinic/jobs/new", label: "Create Job" },
  { href: "/dashboard/clinic/applicants", label: "Applicants" },
  { href: "/dashboard/clinic/notifications", label: "Notifications" },
  { href: "/dashboard/clinic/settings", label: "Settings" },
];

export const adminMenu = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/locums", label: "Locums" },
  { href: "/admin/clinics", label: "Clinics" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/approvals", label: "Approvals" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/specialties", label: "Specialties" },
  { href: "/admin/privacy", label: "Privacy" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/audit-logs", label: "Audit Logs" },
];

