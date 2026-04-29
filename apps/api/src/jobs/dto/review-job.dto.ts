import { IsString } from "class-validator";

export class ReviewJobDto {
  @IsString()
  decision!: "PUBLISHED" | "REJECTED";

  @IsString()
  reason?: string;
}
