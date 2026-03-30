import { IsInt, IsOptional, IsString, Max } from "class-validator";

export class CreateDocumentDto {
  @IsString()
  documentTypeId!: string;

  @IsString()
  fileName!: string;

  @IsString()
  filePath!: string;

  @IsString()
  mimeType!: string;

  @IsInt()
  @Max(50_000_000)
  fileSizeBytes!: number;

  @IsOptional()
  @IsString()
  ownerHint?: "LOCUM" | "CLINIC";
}
