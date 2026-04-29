import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterLocumDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  professionId!: string;

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
