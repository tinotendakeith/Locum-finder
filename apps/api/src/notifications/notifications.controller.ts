import { Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtUser } from "../common/interfaces/jwt-user.interface";
import { NotificationsService } from "./notifications.service";

@ApiTags("notifications")
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: JwtUser) {
    return this.notificationsService.listForUser(user.sub);
  }

  @Post(":id/read")
  read(@CurrentUser() user: JwtUser, @Param("id") id: string) {
    return this.notificationsService.markRead(user.sub, id);
  }
}
