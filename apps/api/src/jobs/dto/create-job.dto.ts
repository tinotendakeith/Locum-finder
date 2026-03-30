import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { UrgencyLevel, WorkMode } from "@prisma/client";

export class CreateJobDto {
  @IsString()
  title!: string;

  @IsString()
  professionId!: string;

  @IsOptional()
  @IsString()
  roleLabel?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  regionId?: string;

  @IsEnum(WorkMode)
  workMode!: WorkMode;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsArray()
  @IsDateString({}, { each: true })
  shiftDates?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  compensationRate?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  responsibilities?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  requiredQualifications?: string;

  @IsOptional()
  @IsDateString()
  applicationDeadline?: string;

  @IsOptional()
  @IsEnum(UrgencyLevel)
  urgency?: UrgencyLevel;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  professionalsNeeded!: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialtyIds?: string[];

  @IsOptional()
  @IsBoolean()
  visibilityPublic?: boolean;
}
