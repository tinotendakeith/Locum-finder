import { AccountStatus, UserRole } from "@prisma/client";

export interface JwtUser {
  sub: string;
  role: UserRole;
  accountStatus: AccountStatus;
  email: string;
}
