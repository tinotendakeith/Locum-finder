import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AccountStatus, UserRole } from "@prisma/client";
import { AllowInactiveStatuses } from "../common/decorators/allow-inactive-statuses.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtUser } from "../common/interfaces/jwt-user.interface";
import { UsersService } from "./users.service";
import { UpdateMeDto } from "./dto.update-me";

@ApiTags("users")
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @AllowInactiveStatuses(AccountStatus.PENDING_APPROVAL, AccountStatus.PENDING_VERIFICATION)
  @Get("users/me")
  me(@CurrentUser() user: JwtUser) {
    return this.usersService.me(user.sub);
  }

  @AllowInactiveStatuses(AccountStatus.PENDING_APPROVAL, AccountStatus.PENDING_VERIFICATION)
  @Patch("users/me")
  updateMe(@CurrentUser() user: JwtUser, @Body() dto: UpdateMeDto) {
    return this.usersService.updateMe(user.sub, dto.phone);
  }

  @Roles(UserRole.ADMIN)
  @Patch("admin/users/:id/status")
  setStatus(
    @CurrentUser() admin: JwtUser,
    @Param("id") id: string,
    @Body("status") status: AccountStatus,
    @Body("reason") reason?: string,
  ) {
    return this.usersService.setStatus(admin.sub, id, status, reason);
  }
}
