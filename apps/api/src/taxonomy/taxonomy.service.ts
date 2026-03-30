import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TaxonomyService {
  constructor(private readonly prisma: PrismaService) {}

  professions() {
    return this.prisma.profession.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  }

  specialties() {
    return this.prisma.specialty.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  }

  facilityTypes() {
    return this.prisma.facilityType.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  }

  regions() {
    return this.prisma.region.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  }
}
