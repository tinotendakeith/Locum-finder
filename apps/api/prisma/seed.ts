import {
  AccountStatus,
  ApplicationStatus,
  ClinicProfileStatus,
  JobStatus,
  LocumProfileStatus,
  PrismaClient,
  ResumeStatus,
  UserRole,
} from "@prisma/client";
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
    { code: "RESUME_SUPPORT", name: "Resume Supporting Document", ownerType: "RESUME", required: false },
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

  const resume = await prisma.resume.upsert({
    where: { id: "seed-resume-1" },
    update: {},
    create: {
      id: "seed-resume-1",
      userId: locumUser.id,
      professionId: profession.id,
      regionId: region.id,
      title: "General Practice CV",
      fullName: "Tariro Moyo",
      professionalTitle: "General Practitioner",
      phone: "+263771234567",
      email: "locum@locumfinder.test",
      location: "Harare",
      summary: "Experienced GP available for urgent and short-term locum assignments.",
      yearsExperience: 7,
      registrationNumber: "MD-2020-4421",
      availability: "Weekends and short-notice cover",
      isDefault: true,
      status: ResumeStatus.ACTIVE,
      specialties: {
        create: [{ specialtyId: gp.id }],
      },
      education: {
        create: [{ institution: "University of Zimbabwe", qualification: "MBChB" }],
      },
      experience: {
        create: [
          {
            employer: "Parirenyatwa Group of Hospitals",
            role: "General Practitioner",
            description: "Managed outpatient and urgent primary care shifts.",
          },
        ],
      },
      memberships: {
        create: [{ associationName: "Medical and Dental Practitioners Council of Zimbabwe", registrationNumber: "MDPCZ-9981" }],
      },
    },
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
        slug: "weekend-gp-cover",
        roleLabel: "Locum GP",
        categoryLabel: "Primary Care",
        department: "Outpatient",
        city: "Harare",
        locationText: "Harare",
        regionId: region.id,
        workMode: "ONSITE",
        startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        durationText: "2 days",
        hoursText: "08:00 - 17:00",
        compensationRate: 45,
        currency: "USD",
        description: "Urgent weekend GP coverage needed for a busy outpatient clinic.",
        responsibilities: "Consult patients, manage acute presentations, hand over critical cases.",
        requirements: "Valid practicing license and recent primary care locum experience.",
        requiredQualifications: "MBChB and active registration.",
        professionalsNeeded: 1,
        status: JobStatus.PUBLISHED,
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

    await prisma.application.upsert({
      where: {
        jobId_applicantUserId: {
          jobId: job.id,
          applicantUserId: locumUser.id,
        },
      },
      update: {},
      create: {
        jobId: job.id,
        applicantUserId: locumUser.id,
        clinicUserId: clinicUser.id,
        resumeId: resume.id,
        status: ApplicationStatus.SUBMITTED,
        message: "Available for weekend coverage and can start immediately.",
        resumeSnapshotJson: JSON.stringify({
          title: resume.title,
          fullName: resume.fullName,
          professionalTitle: resume.professionalTitle,
          yearsExperience: resume.yearsExperience,
        }),
      },
    });
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
