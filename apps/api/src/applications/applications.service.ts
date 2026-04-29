import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ApplicationStatus, JobStatus, NotificationType, ResumeStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateApplicationDto } from "./dto/create-application.dto";

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async apply(userId: string, dto: CreateApplicationDto) {
    const resume = await this.prisma.resume.findUnique({
      where: { id: dto.resumeId },
      include: {
        profession: true,
        region: true,
        specialties: { include: { specialty: true } },
      },
    });

    if (!resume || resume.userId !== userId) {
      throw new NotFoundException("Resume not found.");
    }

    if (resume.status !== ResumeStatus.ACTIVE) {
      throw new ForbiddenException("Only active resumes can be used to apply.");
    }

    const locumProfile = await this.prisma.locumProfile.findUnique({ where: { userId } });
    if (!locumProfile || locumProfile.status !== "APPROVED") {
      throw new ForbiddenException("Only approved locum accounts can apply.");
    }

    const job = await this.prisma.job.findUnique({
      where: { id: dto.jobId },
      include: { clinicProfile: true },
    });

    if (!job || job.status !== JobStatus.PUBLISHED || !job.visibilityPublic) {
      throw new BadRequestException("Job is not open for applications.");
    }

    if (job.applicationDeadline && job.applicationDeadline < new Date()) {
      throw new BadRequestException("This job is no longer accepting applications.");
    }

    const existing = await this.prisma.application.findUnique({
      where: { jobId_applicantUserId: { jobId: dto.jobId, applicantUserId: userId } },
    });
    if (existing) {
      throw new BadRequestException("You already applied for this job.");
    }

    const application = await this.prisma.application.create({
      data: {
        jobId: dto.jobId,
        applicantUserId: userId,
        clinicUserId: job.clinicProfile.userId,
        resumeId: resume.id,
        message: dto.message,
        resumeSnapshotJson: JSON.stringify({
          title: resume.title,
          fullName: resume.fullName,
          professionalTitle: resume.professionalTitle,
          phone: resume.phone,
          email: resume.email,
          location: resume.location,
          summary: resume.summary,
          yearsExperience: resume.yearsExperience,
          profession: resume.profession?.name ?? null,
          region: resume.region?.name ?? null,
          specialties: resume.specialties.map((item) => item.specialty.name),
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

    await this.prisma.notification.createMany({
      data: [
        {
          userId,
          type: NotificationType.APPLICATION_EVENT,
          title: "Application submitted",
          body: `Your application for ${job.title} was submitted successfully.`,
          actionUrl: `/dashboard/applications`,
          metadataJson: JSON.stringify({ applicationId: application.id, jobId: job.id }),
        },
        {
          userId: job.clinicProfile.userId,
          type: NotificationType.APPLICATION_EVENT,
          title: "New application received",
          body: `${resume.fullName} applied for ${job.title}.`,
          actionUrl: `/clinic/jobs/${job.id}/applicants`,
          metadataJson: JSON.stringify({ applicationId: application.id, jobId: job.id, applicantUserId: userId }),
        },
      ],
    });

    return application;
  }

  async myApplications(userId: string) {
    return this.prisma.application.findMany({
      where: { applicantUserId: userId },
      include: {
        resume: {
          select: {
            id: true,
            title: true,
            fullName: true,
            professionalTitle: true,
          },
        },
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
      orderBy: { appliedAt: "desc" },
    });
  }

  async withdraw(userId: string, applicationId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException("Application not found.");
    }

    if (application.applicantUserId !== userId) {
      throw new ForbiddenException("Not authorized for this application.");
    }

    if (application.status === ApplicationStatus.APPROVED || application.status === ApplicationStatus.REJECTED) {
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
      where: { clinicUserId: userId },
      include: {
        resume: {
          select: {
            id: true,
            title: true,
            fullName: true,
            professionalTitle: true,
            yearsExperience: true,
            location: true,
          },
        },
        applicantUser: { select: { id: true, email: true, phone: true } },
        job: { select: { title: true, id: true } },
      },
      orderBy: { appliedAt: "desc" },
    });
  }

  async clinicSetStatus(
    clinicUserId: string,
    applicationId: string,
    status: "UNDER_REVIEW" | "SHORTLISTED" | "APPROVED" | "REJECTED",
    reason?: string,
  ) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: { include: { clinicProfile: true } }, resume: true },
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

    await this.prisma.notification.create({
      data: {
        userId: application.applicantUserId,
        type: NotificationType.APPLICATION_EVENT,
        title: `Application ${nextStatus.toLowerCase().replace(/_/g, " ")}`,
        body: `Your application for ${application.job.title} has been ${nextStatus.toLowerCase().replace(/_/g, " ")}.`,
        actionUrl: "/dashboard/applications",
        metadataJson: JSON.stringify({ applicationId, status: nextStatus, reason }),
      },
    });

    return updated;
  }

  listAdmin() {
    return this.prisma.application.findMany({
      include: {
        job: { select: { id: true, title: true, clinicProfile: { select: { facilityName: true } } } },
        resume: { select: { id: true, fullName: true, professionalTitle: true } },
        applicantUser: { select: { id: true, email: true } },
      },
      orderBy: { appliedAt: "desc" },
      take: 200,
    });
  }
}
