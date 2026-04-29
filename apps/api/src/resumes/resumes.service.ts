import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateResumeDto } from "./dto/create-resume.dto";
import { UpdateResumeDto } from "./dto/update-resume.dto";

@Injectable()
export class ResumesService {
  constructor(private readonly prisma: PrismaService) {}

  listMine(userId: string) {
    return this.prisma.resume.findMany({
      where: { userId },
      include: {
        profession: true,
        region: true,
        applications: { select: { id: true, jobId: true, status: true, appliedAt: true } },
      },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    });
  }

  async getMine(userId: string, resumeId: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { id: resumeId },
      include: {
        education: true,
        experience: true,
        memberships: true,
        specialties: { include: { specialty: true } },
        documents: true,
      },
    });

    if (!resume) {
      throw new NotFoundException("Resume not found.");
    }

    if (resume.userId !== userId) {
      throw new ForbiddenException("You do not own this resume.");
    }

    return resume;
  }

  async create(userId: string, dto: CreateResumeDto) {
    const currentCount = await this.prisma.resume.count({ where: { userId } });

    if (dto.isDefault) {
      await this.prisma.resume.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    return this.prisma.resume.create({
      data: {
        userId,
        title: dto.title,
        fullName: dto.fullName,
        professionalTitle: dto.professionalTitle,
        professionId: dto.professionId,
        phone: dto.phone,
        email: dto.email,
        location: dto.location,
        gender: dto.gender,
        summary: dto.summary,
        yearsExperience: dto.yearsExperience,
        registrationNumber: dto.registrationNumber,
        availability: dto.availability,
        regionId: dto.regionId,
        isDefault: dto.isDefault ?? currentCount === 0,
        status: "ACTIVE",
      },
    });
  }

  async update(userId: string, resumeId: string, dto: UpdateResumeDto) {
    await this.getMine(userId, resumeId);

    if (dto.isDefault) {
      await this.prisma.resume.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    return this.prisma.resume.update({
      where: { id: resumeId },
      data: dto,
    });
  }

  async setDefault(userId: string, resumeId: string) {
    await this.getMine(userId, resumeId);

    await this.prisma.resume.updateMany({ where: { userId }, data: { isDefault: false } });
    return this.prisma.resume.update({ where: { id: resumeId }, data: { isDefault: true } });
  }

  async delete(userId: string, resumeId: string) {
    const resume = await this.getMine(userId, resumeId);

    if (resume.isDefault) {
      const otherResume = await this.prisma.resume.findFirst({
        where: { userId, id: { not: resumeId } },
        orderBy: { createdAt: "asc" },
      });

      if (otherResume) {
        await this.prisma.resume.update({ where: { id: otherResume.id }, data: { isDefault: true } });
      }
    }

    await this.prisma.resume.delete({ where: { id: resumeId } });
    return { success: true };
  }
}
