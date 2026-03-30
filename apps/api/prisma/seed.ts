import { PrismaClient, AccountStatus, UserRole, ClinicProfileStatus, JobStatus, LocumProfileStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const professions = ["Medical Doctor", "Registered Nurse", "Pharmacist", "Radiographer"];
  const specialties = ["General Practice", "Emergency Medicine", "Pediatrics", "Anesthetics", "Surgery"];
  const facilityTypes = ["Clinic", "Hospital", "Medical Center", "Private Practice"];
  const regions = ["Harare", "Bulawayo", "Manicaland", "Midlands", "Mashonaland West"];

  for (const name of professions) {
    await prisma.profession.upsert({ where: { name }, update: {}, create: { name } });
  }
  for (const name of specialties) {
    await prisma.specialty.upsert({ where: { name }, update: {}, create: { name } });
  }
  for (const name of facilityTypes) {
    await prisma.facilityType.upsert({ where: { name }, update: {}, create: { name } });
  }
  for (const name of regions) {
    await prisma.region.upsert({ where: { name }, update: {}, create: { name } });
  }

  const docTypes = [
    { code: "LOCUM_CV", name: "Curriculum Vitae", ownerType: "LOCUM", required: true },
    { code: "LOCUM_LICENSE", name: "Practicing License", ownerType: "LOCUM", required: true },
    { code: "LOCUM_ID", name: "Identity Document", ownerType: "LOCUM", required: true },
    { code: "CLINIC_REGISTRATION", name: "Facility Registration", ownerType: "CLINIC", required: true },
    { code: "CLINIC_LICENSE", name: "Operating License", ownerType: "CLINIC", required: true },
  ] as const;

  for (const dt of docTypes) {
    await prisma.documentType.upsert({
      where: { code: dt.code },
      update: { name: dt.name, required: dt.required },
      create: dt,
    });
  }

  const adminPassword = await bcrypt.hash("Admin1234!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@locumfinder.test" },
    update: {},
    create: {
      email: "admin@locumfinder.test",
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      accountStatus: AccountStatus.ACTIVE,
      emailVerifiedAt: new Date(),
    },
  });

  const profession = await prisma.profession.findFirstOrThrow({ where: { name: "Medical Doctor" } });
  const region = await prisma.region.findFirstOrThrow({ where: { name: "Harare" } });
  const facilityType = await prisma.facilityType.findFirstOrThrow({ where: { name: "Clinic" } });
  const gp = await prisma.specialty.findFirstOrThrow({ where: { name: "General Practice" } });

  const clinicUser = await prisma.user.upsert({
    where: { email: "clinic@locumfinder.test" },
    update: {},
    create: {
      email: "clinic@locumfinder.test",
      passwordHash: await bcrypt.hash("Clinic1234!", 12),
      role: UserRole.CLINIC,
      accountStatus: AccountStatus.ACTIVE,
      emailVerifiedAt: new Date(),
      clinicProfile: {
        create: {
          facilityName: "Central Care Clinic",
          status: ClinicProfileStatus.APPROVED,
          submittedAt: new Date(),
          reviewedAt: new Date(),
          reviewedByUserId: admin.id,
          facilityTypeId: facilityType.id,
          city: "Harare",
          regionId: region.id,
          departments: ["General Practice", "Urgent Care"],
        },
      },
    },
    include: { clinicProfile: true },
  });

  const locumUser = await prisma.user.upsert({
    where: { email: "locum@locumfinder.test" },
    update: {},
    create: {
      email: "locum@locumfinder.test",
      passwordHash: await bcrypt.hash("Locum1234!", 12),
      role: UserRole.LOCUM,
      accountStatus: AccountStatus.ACTIVE,
      emailVerifiedAt: new Date(),
      locumProfile: {
        create: {
          firstName: "Tariro",
          lastName: "Moyo",
          professionId: profession.id,
          professionalTitle: "General Practitioner",
          yearsExperience: 7,
          city: "Harare",
          regionId: region.id,
          languages: ["English", "Shona"],
          status: LocumProfileStatus.APPROVED,
          submittedAt: new Date(),
          reviewedAt: new Date(),
          reviewedByUserId: admin.id,
          completenessScore: 90,
        },
      },
    },
    include: { locumProfile: true },
  });

  if (clinicUser.clinicProfile) {
    const job = await prisma.job.upsert({
      where: { id: "seed-job-1" },
      update: {},
      create: {
        id: "seed-job-1",
        clinicProfileId: clinicUser.clinicProfile.id,
        professionId: profession.id,
        title: "Weekend GP Cover",
        city: "Harare",
        regionId: region.id,
        workMode: "ONSITE",
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        description: "Urgent weekend GP coverage needed.",
        requirements: "Valid practicing license, 3+ years experience",
        professionalsNeeded: 1,
        status: JobStatus.ACTIVE,
        submittedAt: new Date(),
        reviewedAt: new Date(),
        reviewedByUserId: admin.id,
      },
    });

    await prisma.jobSpecialty.upsert({
      where: {
        jobId_specialtyId: {
          jobId: job.id,
          specialtyId: gp.id,
        },
      },
      update: {},
      create: { jobId: job.id, specialtyId: gp.id },
    });

    if (locumUser.locumProfile) {
      await prisma.application.upsert({
        where: {
          jobId_locumProfileId: {
            jobId: job.id,
            locumProfileId: locumUser.locumProfile.id,
          },
        },
        update: {},
        create: {
          jobId: job.id,
          locumProfileId: locumUser.locumProfile.id,
          coverNote: "Available for weekend coverage.",
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
