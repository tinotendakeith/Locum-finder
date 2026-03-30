import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AccountStatus, ClinicProfileStatus, UserRole } from "@prisma/client";
import { AllowInactiveStatuses } from "../common/decorators/allow-inactive-statuses.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { JwtUser } from "../common/interfaces/jwt-user.interface";
import { ClinicsService } from "./clinics.service";
import { UpdateClinicProfileDto } from "./dto/update-clinic-profile.dto";
import { ReviewClinicProfileDto } from "./dto/review-clinic-profile.dto";

@ApiTags("clinics")
@Controller()
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Roles(UserRole.CLINIC)
  @AllowInactiveStatuses(AccountStatus.PENDING_APPROVAL, AccountStatus.PENDING_VERIFICATION)
  @Get("clinics/me")
  me(@CurrentUser() user: JwtUser) {
    return this.clinicsService.me(user.sub);
  }

  @Roles(UserRole.CLINIC)
  @AllowInactiveStatuses(AccountStatus.PENDING_APPROVAL, AccountStatus.PENDING_VERIFICATION)
  @Patch("clinics/me")
  updateMe(@CurrentUser() user: JwtUser, @Body() dto: UpdateClinicProfileDto) {
    return this.clinicsService.updateMe(user.sub, dto as unknown as Record<string, unknown>);
  }

  @Roles(UserRole.CLINIC)
  @AllowInactiveStatuses(AccountStatus.PENDING_APPROVAL, AccountStatus.PENDING_VERIFICATION)
  @Post("clinics/me/submit")
  submit(@CurrentUser() user: JwtUser) {
    return this.clinicsService.submitForReview(user.sub);
  }

  @Roles(UserRole.ADMIN)
  @Get("admin/clinics")
  list(@Query() query: PaginationQueryDto, @Query("status") status?: ClinicProfileStatus) {
    return this.clinicsService.listForAdmin({ page: query.page ?? 1, limit: query.limit ?? 20, status });
  }

  @Roles(UserRole.ADMIN)
  @Patch("admin/clinics/:id/review")
  review(@CurrentUser() admin: JwtUser, @Param("id") id: string, @Body() dto: ReviewClinicProfileDto) {
    return this.clinicsService.reviewByAdmin(admin.sub, id, dto.decision, dto.reason, dto.adminNotes);
  }
}
