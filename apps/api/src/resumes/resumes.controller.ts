import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtUser } from "../common/interfaces/jwt-user.interface";
import { CreateResumeDto } from "./dto/create-resume.dto";
import { UpdateResumeDto } from "./dto/update-resume.dto";
import { ResumesService } from "./resumes.service";

@ApiTags("resumes")
@Roles(UserRole.LOCUM)
@Controller("resumes")
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Get()
  listMine(@CurrentUser() user: JwtUser) {
    return this.resumesService.listMine(user.sub);
  }

  @Get(":id")
  getMine(@CurrentUser() user: JwtUser, @Param("id") id: string) {
    return this.resumesService.getMine(user.sub, id);
  }

  @Post()
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateResumeDto) {
    return this.resumesService.create(user.sub, dto);
  }

  @Patch(":id")
  update(@CurrentUser() user: JwtUser, @Param("id") id: string, @Body() dto: UpdateResumeDto) {
    return this.resumesService.update(user.sub, id, dto);
  }

  @Post(":id/default")
  setDefault(@CurrentUser() user: JwtUser, @Param("id") id: string) {
    return this.resumesService.setDefault(user.sub, id);
  }

  @Delete(":id")
  remove(@CurrentUser() user: JwtUser, @Param("id") id: string) {
    return this.resumesService.delete(user.sub, id);
  }
}
