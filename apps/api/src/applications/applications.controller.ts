import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtUser } from "../common/interfaces/jwt-user.interface";
import { ApplicationsService } from "./applications.service";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationStatusDto } from "./dto/update-application-status.dto";

@ApiTags("applications")
@Controller()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Roles(UserRole.LOCUM)
  @Post("locum/applications")
  apply(@CurrentUser() user: JwtUser, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.apply(user.sub, dto);
  }

  @Roles(UserRole.LOCUM)
  @Get("locum/applications")
  myApplications(@CurrentUser() user: JwtUser) {
    return this.applicationsService.myApplications(user.sub);
  }

  @Roles(UserRole.LOCUM)
  @Post("locum/applications/:id/withdraw")
  withdraw(@CurrentUser() user: JwtUser, @Param("id") id: string) {
    return this.applicationsService.withdraw(user.sub, id);
  }

  @Roles(UserRole.CLINIC)
  @Get("clinic/applications")
  clinicApplications(@CurrentUser() user: JwtUser) {
    return this.applicationsService.clinicApplications(user.sub);
  }

  @Roles(UserRole.CLINIC)
  @Patch("clinic/applications/:id/status")
  updateStatus(@CurrentUser() user: JwtUser, @Param("id") id: string, @Body() dto: UpdateApplicationStatusDto) {
    return this.applicationsService.clinicSetStatus(user.sub, id, dto.status, dto.reason);
  }

  @Roles(UserRole.ADMIN)
  @Get("admin/applications")
  listAdmin() {
    return this.applicationsService.listAdmin();
  }
}
