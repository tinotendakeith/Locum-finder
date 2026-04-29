import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from "class-validator";

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

  @IsBoolean()
  acceptedPrivacyNotice!: boolean;

  @IsBoolean()
  acceptedSensitiveDataUse!: boolean;

  @IsOptional()
  @IsBoolean()
  marketingOptIn?: boolean;
}
