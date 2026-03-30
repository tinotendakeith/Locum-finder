import { IsArray, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateLocumProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  professionalTitle?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(80)
  yearsExperience?: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsString()
  availabilitySummary?: string;

  @IsOptional()
  @IsString()
  workPreferences?: string;
}
