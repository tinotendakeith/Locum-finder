import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AccountStatus, LocumProfileStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LocumsService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    const profile = await this.prisma.locumProfile.findUnique({
      where: { userId },
      include: {
        profession: true,
        region: true,
      },
    });

    if (!profile) {
      throw new NotFoundException("Locum profile not found.");
    }

    return profile;
  }

  async updateMe(userId: string, data: Record<string, unknown>) {
    const profile = await this.prisma.locumProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException("Locum profile not found.");
    }

    return this.prisma.locumProfile.update({
      where: { userId },
      data,
    });
  }

  async submitForReview(userId: string) {
    const profile = await this.prisma.locumProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException("Locum profile not found.");
    }

    if (profile.status === LocumProfileStatus.APPROVED) {
      throw new BadRequestException("Profile already approved.");
    }

    return this.prisma.locumProfile.update({
      where: { userId },
      data: {
        status: LocumProfileStatus.SUBMITTED,
        submittedAt: new Date(),
      },
    });
  }

  listForAdmin(query: { page: number; limit: number; status?: LocumProfileStatus }) {
    const where = query.status ? { status: query.status } : {};
    return this.prisma.locumProfile.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true } }, profession: true },
    });
  }

  async reviewByAdmin(
    adminUserId: string,
    profileId: string,
    decision: "APPROVED" | "REJECTED" | "SUSPENDED",
    reason?: string,
    adminNotes?: string,
  ) {
    const profile = await this.prisma.locumProfile.findUnique({
      where: { id: profileId },
      include: { user: true },
    });

    if (!profile) {
      throw new NotFoundException("Locum profile not found.");
    }

    const nextStatus = decision as LocumProfileStatus;

    const updated = await this.prisma.locumProfile.update({
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
        action: "LOCUM_PROFILE_REVIEWED",
        entityType: "LocumProfile",
        entityId: profileId,
        metadataJson: JSON.stringify({ decision, reason }),
      },
    });

    return updated;
  }
}
