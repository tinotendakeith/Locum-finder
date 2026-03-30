import { IsOptional, IsString } from "class-validator";

export class ReviewLocumProfileDto {
  @IsString()
  decision!: "APPROVED" | "REJECTED" | "SUSPENDED";

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
