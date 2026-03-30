import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { JobStatus, UrgencyLevel } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { JobsQueryDto } from "./dto/jobs-query.dto";

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublic(query: JobsQueryDto) {
    const where = {
      visibilityPublic: true,
      status: query.status ?? JobStatus.ACTIVE,
      ...(query.professionId ? { professionId: query.professionId } : {}),
      ...(query.city ? { city: { contains: query.city, mode: "insensitive" as const } } : {}),
      ...(query.urgent ? { urgency: { in: [UrgencyLevel.HIGH, UrgencyLevel.CRITICAL] } } : {}),
      ...(query.q
        ? {
            OR: [
              { title: { contains: query.q, mode: "insensitive" as const } },
              { description: { contains: query.q, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(query.specialtyId
        ? {
            specialties: {
              some: {
                specialtyId: query.specialtyId,
              },
            },
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.job.findMany({
        where,
        skip: ((query.page ?? 1) - 1) * (query.limit ?? 20),
        take: query.limit ?? 20,
        orderBy: [{ urgency: "desc" }, { startDate: "asc" }],
        include: {
          clinicProfile: { select: { facilityName: true, city: true } },
          profession: true,
          specialties: { include: { specialty: true } },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      items,
      pagination: { page: query.page ?? 1, limit: query.limit ?? 20, total },
    };
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        clinicProfile: { select: { facilityName: true, city: true, region: true } },
        profession: true,
        specialties: { include: { specialty: true } },
      },
    });

    if (!job) {
      throw new NotFoundException("Job not found.");
    }

    return job;
  }

  async createForClinic(userId: string, dto: CreateJobDto) {
    const clinic = await this.prisma.clinicProfile.findUnique({ where: { userId } });
    if (!clinic) {
      throw new NotFoundException("Clinic profile not found.");
    }

    const created = await this.prisma.job.create({
      data: {
        clinicProfileId: clinic.id,
        professionId: dto.professionId,
        title: dto.title,
        roleLabel: dto.roleLabel,
        department: dto.department,
        city: dto.city,
        regionId: dto.regionId,
        workMode: dto.workMode,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        shiftDates: dto.shiftDates?.map((d) => new Date(d)) ?? [],
        compensationRate: dto.compensationRate,
        currency: dto.currency ?? "USD",
        description: dto.description,
        responsibilities: dto.responsibilities,
        requirements: dto.requirements,
        requiredQualifications: dto.requiredQualifications,
        applicationDeadline: dto.applicationDeadline ? new Date(dto.applicationDeadline) : undefined,
        urgency: dto.urgency ?? UrgencyLevel.MEDIUM,
        professionalsNeeded: dto.professionalsNeeded,
        visibilityPublic: dto.visibilityPublic ?? true,
        status: JobStatus.DRAFT,
        specialties: dto.specialtyIds?.length
          ? {
              createMany: {
                data: dto.specialtyIds.map((specialtyId) => ({ specialtyId })),
              },
            }
          : undefined,
      },
      include: { specialties: true },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: userId,
        action: "JOB_CREATED",
        entityType: "Job",
        entityId: created.id,
      },
    });

    return created;
  }

  async listClinicJobs(userId: string, query: JobsQueryDto) {
    const clinic = await this.prisma.clinicProfile.findUnique({ where: { userId } });
    if (!clinic) {
      throw new NotFoundException("Clinic profile not found.");
    }

    const where = {
      clinicProfileId: clinic.id,
      ...(query.status ? { status: query.status } : {}),
      ...(query.q ? { title: { contains: query.q, mode: "insensitive" as const } } : {}),
    };

    return this.prisma.job.findMany({
      where,
      skip: ((query.page ?? 1) - 1) * (query.limit ?? 20),
      take: query.limit ?? 20,
      orderBy: { createdAt: "desc" },
    });
  }

  async updateClinicJob(userId: string, jobId: string, dto: UpdateJobDto) {
    const job = await this.mustOwnClinicJob(userId, jobId);
    if ([JobStatus.CLOSED, JobStatus.CANCELLED, JobStatus.FILLED].includes(job.status)) {
      throw new BadRequestException("Cannot edit closed/cancelled/filled jobs.");
    }

    const { specialtyIds, ...jobData } = dto;

    if (specialtyIds) {
      await this.prisma.jobSpecialty.deleteMany({ where: { jobId } });
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        ...jobData,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        applicationDeadline: dto.applicationDeadline ? new Date(dto.applicationDeadline) : undefined,
        shiftDates: dto.shiftDates?.map((d) => new Date(d)),
        specialties: specialtyIds
          ? {
              createMany: {
                data: specialtyIds.map((specialtyId) => ({ specialtyId })),
              },
            }
          : undefined,
      },
    });
  }

  async submitClinicJob(userId: string, jobId: string) {
    await this.mustOwnClinicJob(userId, jobId);
    return this.prisma.job.update({
      where: { id: jobId },
      data: { status: JobStatus.PENDING_APPROVAL, submittedAt: new Date() },
    });
  }

  async closeClinicJob(userId: string, jobId: string) {
    await this.mustOwnClinicJob(userId, jobId);
    return this.prisma.job.update({
      where: { id: jobId },
      data: { status: JobStatus.CLOSED, closedAt: new Date() },
    });
  }

  async reviewByAdmin(adminUserId: string, jobId: string, decision: "ACTIVE" | "REJECTED", reason?: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException("Job not found.");
    }

    const updated = await this.prisma.job.update({
      where: { id: jobId },
      data: {
        status: decision === "ACTIVE" ? JobStatus.ACTIVE : JobStatus.REJECTED,
        reviewedAt: new Date(),
        reviewedByUserId: adminUserId,
        rejectionReason: decision === "REJECTED" ? reason : null,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: adminUserId,
        action: "JOB_REVIEWED",
        entityType: "Job",
        entityId: jobId,
        metadataJson: JSON.stringify({ decision, reason }),
      },
    });

    return updated;
  }

  private async mustOwnClinicJob(userId: string, jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: { clinicProfile: true },
    });

    if (!job) {
      throw new NotFoundException("Job not found.");
    }

    if (job.clinicProfile.userId !== userId) {
      throw new ForbiddenException("Not authorized to access this job.");
    }

    return job;
  }
}
