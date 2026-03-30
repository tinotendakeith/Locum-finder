import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { LocumsModule } from "./locums/locums.module";
import { ClinicsModule } from "./clinics/clinics.module";
import { JobsModule } from "./jobs/jobs.module";
import { ApplicationsModule } from "./applications/applications.module";
import { DocumentsModule } from "./documents/documents.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { TaxonomyModule } from "./taxonomy/taxonomy.module";
import { AuditModule } from "./audit/audit.module";
import { AdminModule } from "./admin/admin.module";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { AccountStatusGuard } from "./common/guards/account-status.guard";
import { HealthController } from "./health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    LocumsModule,
    ClinicsModule,
    JobsModule,
    ApplicationsModule,
    DocumentsModule,
    NotificationsModule,
    TaxonomyModule,
    AuditModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: AccountStatusGuard },
  ],
})
export class AppModule {}
