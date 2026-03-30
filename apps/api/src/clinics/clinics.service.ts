import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AccountStatus, ClinicProfileStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ClinicsService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    const profile = await this.prisma.clinicProfile.findUnique({
      where: { userId },
      include: { facilityType: true, region: true },
    });

    if (!profile) {
      throw new NotFoundException("Clinic profile not found.");
    }

    return profile;
  }

  async updateMe(userId: string, data: Record<string, unknown>) {
    const profile = await this.prisma.clinicProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException("Clinic profile not found.");
    }

    return this.prisma.clinicProfile.update({
      where: { userId },
      data,
    });
  }

  async submitForReview(userId: string) {
    const profile = await this.prisma.clinicProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException("Clinic profile not found.");
    }

    if (profile.status === ClinicProfileStatus.APPROVED) {
      throw new BadRequestException("Clinic already approved.");
    }

    return this.prisma.clinicProfile.update({
      where: { userId },
      data: {
        status: ClinicProfileStatus.SUBMITTED,
        submittedAt: new Date(),
      },
    });
  }

  listForAdmin(query: { page: number; limit: number; status?: ClinicProfileStatus }) {
    const where = query.status ? { status: query.status } : {};
    return this.prisma.clinicProfile.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true } }, facilityType: true },
    });
  }

  async reviewByAdmin(
    adminUserId: string,
    profileId: string,
    decision: "APPROVED" | "REJECTED" | "SUSPENDED",
    reason?: string,
    adminNotes?: string,
  ) {
    const profile = await this.prisma.clinicProfile.findUnique({ where: { id: profileId } });
    if (!profile) {
      throw new NotFoundException("Clinic profile not found.");
    }

    const nextStatus = decision as ClinicProfileStatus;
    const updated = await this.prisma.clinicProfile.update({
      where: { id: profileId },
      data: {
        status: nextStatus,
        reviewedAt: new Date(),
        reviewedByUserId: adminUserId,
        rejectionReason: decision === "REJECTED" ? reason : null,
        adminNotes,
      },
    });

    await this.prisma.user.update({
      where: { id: profile.userId },
      data: {
        accountStatus:
          decision === "APPROVED"
            ? AccountStatus.ACTIVE
            : decision === "SUSPENDED"
              ? AccountStatus.SUSPENDED
              : AccountStatus.REJECTED,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: adminUserId,
        action: "CLINIC_PROFILE_REVIEWED",
        entityType: "ClinicProfile",
        entityId: profileId,
        metadataJson: JSON.stringify({ decision, reason }),
      },
    });

    return updated;
  }
}
