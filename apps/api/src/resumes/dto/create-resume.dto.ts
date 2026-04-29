import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateResumeDto {
  @IsString()
  title!: string;

  @IsString()
  fullName!: string;

  @IsOptional()
  @IsString()
  professionalTitle?: string;

  @IsOptional()
  @IsString()
  professionId?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsExperience?: number;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @IsString()
  regionId?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
