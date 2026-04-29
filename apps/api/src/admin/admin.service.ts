import { Injectable } from "@nestjs/common";
import { ClinicProfileStatus, JobStatus, LocumProfileStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async metrics() {
    const pendingJobWhere = {
      status: JobStatus.DRAFT,
      submittedAt: { not: null as Date | null },
      reviewedAt: null,
    };

    const [users, jobs, applications, pendingLocums, pendingClinics, pendingJobs] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.job.count(),
      this.prisma.application.count(),
      this.prisma.locumProfile.count({ where: { status: LocumProfileStatus.SUBMITTED } }),
      this.prisma.clinicProfile.count({ where: { status: ClinicProfileStatus.SUBMITTED } }),
      this.prisma.job.count({ where: pendingJobWhere }),
    ]);

    return {
      users,
      jobs,
      applications,
      pendingLocums,
      pendingClinics,
      pendingJobs,
    };
  }

  async approvals() {
    const pendingJobWhere = {
      status: JobStatus.DRAFT,
      submittedAt: { not: null as Date | null },
      reviewedAt: null,
    };

    const [locums, clinics, jobs] = await this.prisma.$transaction([
      this.prisma.locumProfile.findMany({ where: { status: LocumProfileStatus.SUBMITTED }, take: 50 }),
      this.prisma.clinicProfile.findMany({ where: { status: ClinicProfileStatus.SUBMITTED }, take: 50 }),
      this.prisma.job.findMany({ where: pendingJobWhere, take: 50 }),
    ]);

    return { locums, clinics, jobs };
  }

  auditLogs() {
    return this.auditService.listRecent(200);
  }
}
