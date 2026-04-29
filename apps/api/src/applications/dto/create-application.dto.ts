import { IsOptional, IsString } from "class-validator";

export class CreateApplicationDto {
  @IsString()
  jobId!: string;

  @IsString()
  resumeId!: string;

  @IsOptional()
  @IsString()
  message?: string;
}
