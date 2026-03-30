import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { DocumentOwnerType, DocumentReviewStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDocumentDto } from "./dto/create-document.dto";

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createForUser(userId: string, dto: CreateDocumentDto) {
    const [locum, clinic] = await this.prisma.$transaction([
      this.prisma.locumProfile.findUnique({ where: { userId } }),
      this.prisma.clinicProfile.findUnique({ where: { userId } }),
    ]);

    if (!locum && !clinic) {
      throw new NotFoundException("No profile found for this account.");
    }

    if (dto.ownerHint === "LOCUM" && !locum) {
      throw new ForbiddenException("No locum profile found.");
    }

    if (dto.ownerHint === "CLINIC" && !clinic) {
      throw new ForbiddenException("No clinic profile found.");
    }

    const ownerType = dto.ownerHint ?? (locum ? DocumentOwnerType.LOCUM : DocumentOwnerType.CLINIC);

    return this.prisma.document.create({
      data: {
        ownerType,
        ownerLocumProfileId: ownerType === DocumentOwnerType.LOCUM ? locum?.id : undefined,
        ownerClinicProfileId: ownerType === DocumentOwnerType.CLINIC ? clinic?.id : undefined,
        documentTypeId: dto.documentTypeId,
        fileName: dto.fileName,
        filePath: dto.filePath,
        mimeType: dto.mimeType,
        fileSizeBytes: dto.fileSizeBytes,
      },
    });
  }

  async listMine(userId: string) {
    const [locum, clinic] = await this.prisma.$transaction([
      this.prisma.locumProfile.findUnique({ where: { userId } }),
      this.prisma.clinicProfile.findUnique({ where: { userId } }),
    ]);

    return this.prisma.document.findMany({
      where: {
        OR: [
          ...(locum ? [{ ownerLocumProfileId: locum.id }] : []),
          ...(clinic ? [{ ownerClinicProfileId: clinic.id }] : []),
        ],
      },
      include: { documentType: true },
      orderBy: { createdAt: "desc" },
    });
  }

  listForAdmin() {
    return this.prisma.document.findMany({
      include: {
        documentType: true,
        ownerLocumProfile: { select: { firstName: true, lastName: true } },
        ownerClinicProfile: { select: { facilityName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    });
  }

  review(adminUserId: string, documentId: string, decision: "APPROVED" | "REJECTED", reason?: string) {
    return this.prisma.document.update({
      where: { id: documentId },
      data: {
        reviewStatus:
          decision === "APPROVED" ? DocumentReviewStatus.APPROVED : DocumentReviewStatus.REJECTED,
        reviewedByUserId: adminUserId,
        reviewedAt: new Date(),
        rejectionReason: decision === "REJECTED" ? reason : null,
      },
    });
  }

  createUploadUrl(fileName: string, mimeType: string) {
    return {
      uploadUrl: `https://example-s3.local/upload/${encodeURIComponent(fileName)}`,
      filePath: `uploads/${Date.now()}-${fileName}`,
      mimeType,
    };
  }
}
