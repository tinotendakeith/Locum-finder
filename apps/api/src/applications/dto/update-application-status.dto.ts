import { IsOptional, IsString } from "class-validator";

export class UpdateApplicationStatusDto {
  @IsString()
  status!: "UNDER_REVIEW" | "SHORTLISTED" | "APPROVED" | "REJECTED";

  @IsOptional()
  @IsString()
  reason?: string;
}
