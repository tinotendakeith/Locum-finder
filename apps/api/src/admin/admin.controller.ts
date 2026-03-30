import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { AdminService } from "./admin.service";

@ApiTags("admin")
@Roles(UserRole.ADMIN)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("dashboard/metrics")
  metrics() {
    return this.adminService.metrics();
  }

  @Get("approvals")
  approvals() {
    return this.adminService.approvals();
  }

  @Get("audit-logs")
  auditLogs() {
    return this.adminService.auditLogs();
  }
}
