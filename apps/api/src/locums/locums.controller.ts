import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AccountStatus, LocumProfileStatus, UserRole } from "@prisma/client";
import { AllowInactiveStatuses } from "../common/decorators/allow-inactive-statuses.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { JwtUser } from "../common/interfaces/jwt-user.interface";
import { LocumsService } from "./locums.service";
import { UpdateLocumProfileDto } from "./dto/update-locum-profile.dto";
import { ReviewLocumProfileDto } from "./dto/review-locum-profile.dto";

@ApiTags("locums")
@Controller()
export class LocumsController {
  constructor(private readonly locumsService: LocumsService) {}

  @Roles(UserRole.LOCUM)
  @AllowInactiveStatuses(AccountStatus.PENDING_APPROVAL, AccountStatus.PENDING_VERIFICATION)
  @Get("locums/me")
  me(@CurrentUser() user: JwtUser) {
    return this.locumsService.me(user.sub);
  }

  @Roles(UserRole.LOCUM)
  @AllowInactiveStatuses(AccountStatus.PENDING_APPROVAL, AccountStatus.PENDING_VERIFICATION)
  @Patch("locums/me")
  updateMe(@CurrentUser() user: JwtUser, @Body() dto: UpdateLocumProfileDto) {
    return this.locumsService.updateMe(user.sub, dto as unknown as Record<string, unknown>);
  }

  @Roles(UserRole.LOCUM)
  @AllowInactiveStatuses(AccountStatus.PENDING_APPROVAL, AccountStatus.PENDING_VERIFICATION)
  @Post("locums/me/submit")
  submit(@CurrentUser() user: JwtUser) {
    return this.locumsService.submitForReview(user.sub);
  }

  @Roles(UserRole.ADMIN)
  @Get("admin/locums")
  list(@Query() query: PaginationQueryDto, @Query("status") status?: LocumProfileStatus) {
    return this.locumsService.listForAdmin({ page: query.page ?? 1, limit: query.limit ?? 20, status });
  }

  @Roles(UserRole.ADMIN)
  @Patch("admin/locums/:id/review")
  review(@CurrentUser() admin: JwtUser, @Param("id") id: string, @Body() dto: ReviewLocumProfileDto) {
    return this.locumsService.reviewByAdmin(admin.sub, id, dto.decision, dto.reason, dto.adminNotes);
  }
}
