import { IsOptional, IsString } from "class-validator";

export class ReviewDocumentDto {
  @IsString()
  decision!: "APPROVED" | "REJECTED";

  @IsOptional()
  @IsString()
  reason?: string;
}
