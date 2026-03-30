import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ApplicationStatus, JobStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateApplicationDto } from "./dto/create-application.dto";

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async apply(userId: string, dto: CreateApplicationDto) {
    const locum = await this.prisma.locumProfile.findUnique({ where: { userId } });
    if (!locum) {
      throw new NotFoundException("Locum profile not found.");
    }

    if (locum.status !== "APPROVED") {
      throw new ForbiddenException("Only approved locum profiles can apply.");
    }

    const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
    if (!job || job.status !== JobStatus.ACTIVE) {
      throw new BadRequestException("Job is not open for applications.");
    }

    const existing = await this.prisma.application.findUnique({
      where: { jobId_locumProfileId: { jobId: dto.jobId, locumProfileId: locum.id } },
    });
    if (existing) {
      throw new BadRequestException("You already applied for this job.");
    }

    const application = await this.prisma.application.create({
      data: {
        jobId: dto.jobId,
        locumProfileId: locum.id,
        coverNote: dto.coverNote,
        cvDocumentId: dto.cvDocumentId,
        profileSnapshotJson: JSON.stringify({
          firstName: locum.firstName,
          lastName: locum.lastName,
          professionalTitle: locum.professionalTitle,
          yearsExperience: locum.yearsExperience,
        }),
        status: ApplicationStatus.SUBMITTED,
      },
    });

    await this.prisma.applicationHistory.create({
      data: {
        applicationId: application.id,
        toStatus: ApplicationStatus.SUBMITTED,
        actorUserId: userId,
      },
    });

    return application;
  }

  async myApplications(userId: string) {
    const locum = await this.prisma.locumProfile.findUnique({ where: { userId } });
    if (!locum) {
      throw new NotFoundException("Locum profile not found.");
    }

    return this.prisma.application.findMany({
      where: { locumProfileId: locum.id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            city: true,
            startDate: true,
            status: true,
            clinicProfile: { select: { facilityName: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async withdraw(userId: string, applicationId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { locumProfile: true },
    });

    if (!application) {
      throw new NotFoundException("Application not found.");
    }

    if (application.locumProfile.userId !== userId) {
      throw new ForbiddenException("Not authorized for this application.");
    }

    if ([ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED].includes(application.status)) {
      throw new BadRequestException("Cannot withdraw finalized application.");
    }

    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status: ApplicationStatus.WITHDRAWN,
        withdrawnAt: new Date(),
      },
    });

    await this.prisma.applicationHistory.create({
      data: {
        applicationId,
        fromStatus: application.status,
        toStatus: ApplicationStatus.WITHDRAWN,
        actorUserId: userId,
      },
    });

    return updated;
  }

  async clinicApplications(userId: string) {
    const clinic = await this.prisma.clinicProfile.findUnique({ where: { userId } });
    if (!clinic) {
      throw new NotFoundException("Clinic profile not found.");
    }

    return this.prisma.application.findMany({
      where: { job: { clinicProfileId: clinic.id } },
      include: {
        locumProfile: { select: { firstName: true, lastName: true, professionalTitle: true, yearsExperience: true } },
        job: { select: { title: true, id: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async clinicSetStatus(
    clinicUserId: string,
    applicationId: string,
    status: "UNDER_REVIEW" | "SHORTLISTED" | "ACCEPTED" | "REJECTED" | "CANCELLED",
    reason?: string,
  ) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: { include: { clinicProfile: true } } },
    });

    if (!application) {
      throw new NotFoundException("Application not found.");
    }

    if (application.job.clinicProfile.userId !== clinicUserId) {
      throw new ForbiddenException("Cannot update application for another clinic.");
    }

    const nextStatus = status as ApplicationStatus;
    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        status: nextStatus,
        reviewedAt: new Date(),
        reviewedByClinicUserId: clinicUserId,
        statusReason: reason,
      },
    });

    await this.prisma.applicationHistory.create({
      data: {
        applicationId,
        fromStatus: application.status,
        toStatus: nextStatus,
        actorUserId: clinicUserId,
        note: reason,
      },
    });

    return updated;
  }

  listAdmin() {
    return this.prisma.application.findMany({
      include: {
        job: { select: { id: true, title: true, clinicProfile: { select: { facilityName: true } } } },
        locumProfile: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  }
}
