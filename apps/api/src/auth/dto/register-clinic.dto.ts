import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterClinicDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  facilityName!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
