import { BadRequestException, Injectable } from "@nestjs/common";
import { AccountStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        accountStatus: true,
        emailVerifiedAt: true,
        createdAt: true,
      },
    });
  }

  updateMe(userId: string, phone?: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { phone },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        accountStatus: true,
      },
    });
  }

  async setStatus(adminUserId: string, userId: string, status: AccountStatus, reason?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException("User not found.");
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { accountStatus: status },
      select: { id: true, email: true, role: true, accountStatus: true },
    });

    await this.prisma.auditLog.create({
      data: {
        actorUserId: adminUserId,
        action: "USER_STATUS_UPDATED",
        entityType: "User",
        entityId: userId,
        metadataJson: JSON.stringify({ status, reason }),
      },
    });

    return updated;
  }
}
