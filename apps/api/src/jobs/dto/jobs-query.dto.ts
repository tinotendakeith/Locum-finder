import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { JobStatus } from "@prisma/client";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";

export class JobsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  professionId?: string;

  @IsOptional()
  @IsString()
  specialtyId?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @Type(() => Boolean)
  @IsOptional()
  urgent?: boolean;
}
