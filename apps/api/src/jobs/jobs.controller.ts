import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Public } from "../common/decorators/public.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtUser } from "../common/interfaces/jwt-user.interface";
import { JobsService } from "./jobs.service";
import { JobsQueryDto } from "./dto/jobs-query.dto";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { ReviewJobDto } from "./dto/review-job.dto";

@ApiTags("jobs")
@Controller()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Public()
  @Get("jobs")
  listPublic(@Query() query: JobsQueryDto) {
    return this.jobsService.listPublic(query);
  }

  @Public()
  @Get("jobs/:id")
  findOne(@Param("id") id: string) {
    return this.jobsService.findOne(id);
  }

  @Roles(UserRole.CLINIC)
  @Get("clinic/jobs")
  listClinicJobs(@CurrentUser() user: JwtUser, @Query() query: JobsQueryDto) {
    return this.jobsService.listClinicJobs(user.sub, query);
  }

  @Roles(UserRole.CLINIC)
  @Post("clinic/jobs")
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateJobDto) {
    return this.jobsService.createForClinic(user.sub, dto);
  }

  @Roles(UserRole.CLINIC)
  @Patch("clinic/jobs/:id")
  update(@CurrentUser() user: JwtUser, @Param("id") id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.updateClinicJob(user.sub, id, dto);
  }

  @Roles(UserRole.CLINIC)
  @Post("clinic/jobs/:id/submit")
  submit(@CurrentUser() user: JwtUser, @Param("id") id: string) {
    return this.jobsService.submitClinicJob(user.sub, id);
  }

  @Roles(UserRole.CLINIC)
  @Post("clinic/jobs/:id/close")
  close(@CurrentUser() user: JwtUser, @Param("id") id: string) {
    return this.jobsService.closeClinicJob(user.sub, id);
  }

  @Roles(UserRole.ADMIN)
  @Patch("admin/jobs/:id/review")
  review(@CurrentUser() user: JwtUser, @Param("id") id: string, @Body() dto: ReviewJobDto) {
    return this.jobsService.reviewByAdmin(user.sub, id, dto.decision, dto.reason);
  }
}
