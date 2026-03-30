import { SetMetadata } from "@nestjs/common";
import { AccountStatus } from "@prisma/client";

export const ALLOW_INACTIVE_KEY = "allowInactiveStatuses";
export const AllowInactiveStatuses = (...statuses: AccountStatus[]) =>
  SetMetadata(ALLOW_INACTIVE_KEY, statuses);
