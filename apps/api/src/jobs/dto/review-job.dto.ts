import { IsOptional, IsString } from "class-validator";

export class ReviewJobDto {
  @IsString()
  decision!: "ACTIVE" | "REJECTED";

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
