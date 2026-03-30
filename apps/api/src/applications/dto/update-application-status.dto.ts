import { IsOptional, IsString } from "class-validator";

export class UpdateApplicationStatusDto {
  @IsString()
  status!: "UNDER_REVIEW" | "SHORTLISTED" | "ACCEPTED" | "REJECTED" | "CANCELLED";

  @IsOptional()
  @IsString()
  reason?: string;
}
