import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtUser } from "../interfaces/jwt-user.interface";

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): JwtUser => {
  const req = ctx.switchToHttp().getRequest();
  return req.user as JwtUser;
});
