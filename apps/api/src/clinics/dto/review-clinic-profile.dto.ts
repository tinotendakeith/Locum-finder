import { IsOptional, IsString } from "class-validator";

export class ReviewClinicProfileDto {
  @IsString()
  decision!: "APPROVED" | "REJECTED" | "SUSPENDED";

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
