import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AccountStatus } from "@prisma/client";
import { ALLOW_INACTIVE_KEY } from "../decorators/allow-inactive-statuses.decorator";
import { JwtUser } from "../interfaces/jwt-user.interface";

@Injectable()
export class AccountStatusGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user as JwtUser | undefined;

    if (!user) {
      return true;
    }

    const allowed = this.reflector.getAllAndOverride<AccountStatus[]>(ALLOW_INACTIVE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (user.accountStatus === AccountStatus.ACTIVE || (allowed && allowed.includes(user.accountStatus))) {
      return true;
    }

    throw new ForbiddenException(`Account status ${user.accountStatus} is not allowed for this action.`);
  }
}
