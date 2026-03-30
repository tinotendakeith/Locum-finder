import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  listRecent(limit = 100) {
    return this.prisma.auditLog.findMany({
      include: { actor: { select: { id: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
