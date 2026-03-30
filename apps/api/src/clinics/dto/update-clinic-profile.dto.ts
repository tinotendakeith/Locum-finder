import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateClinicProfileDto {
  @IsOptional()
  @IsString()
  facilityName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  departments?: string[];

  @IsOptional()
  @IsString()
  contactPersonName?: string;
}
