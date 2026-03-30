import { IsOptional, IsString } from "class-validator";

export class CreateApplicationDto {
  @IsString()
  jobId!: string;

  @IsOptional()
  @IsString()
  coverNote?: string;

  @IsOptional()
  @IsString()
  cvDocumentId?: string;
}
