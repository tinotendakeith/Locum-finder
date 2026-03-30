import { z } from "zod";

export const userRoleSchema = z.enum(["ADMIN", "CLINIC", "LOCUM"]);
export const accountStatusSchema = z.enum([
  "ACTIVE",
  "PENDING_VERIFICATION",
  "PENDING_APPROVAL",
  "SUSPENDED",
  "REJECTED",
  "DEACTIVATED",
]);

export const jobStatusSchema = z.enum([
  "DRAFT",
  "PENDING_APPROVAL",
  "ACTIVE",
  "CLOSED",
  "FILLED",
  "CANCELLED",
  "EXPIRED",
  "REJECTED",
]);

export const applicationStatusSchema = z.enum([
  "SUBMITTED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
  "CANCELLED",
]);

export const paginatedMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
});

export const createJobSchema = z.object({
  title: z.string().min(3),
  professionId: z.string().min(1),
  description: z.string().min(10),
  workMode: z.enum(["ONSITE", "HYBRID", "REMOTE"]),
  startDate: z.string(),
  professionalsNeeded: z.number().int().positive(),
  city: z.string().optional(),
  regionId: z.string().optional(),
  specialtyIds: z.array(z.string()).optional(),
});

export const createApplicationSchema = z.object({
  jobId: z.string().min(1),
  coverNote: z.string().max(2000).optional(),
  cvDocumentId: z.string().optional(),
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type AccountStatus = z.infer<typeof accountStatusSchema>;
export type JobStatus = z.infer<typeof jobStatusSchema>;
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
