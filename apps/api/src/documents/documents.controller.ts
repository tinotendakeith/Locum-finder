import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtUser } from "../common/interfaces/jwt-user.interface";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { ReviewDocumentDto } from "./dto/review-document.dto";
import { DocumentsService } from "./documents.service";

@ApiTags("documents")
@Controller()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post("documents/upload-url")
  createUploadUrl(@Body("fileName") fileName: string, @Body("mimeType") mimeType: string) {
    return this.documentsService.createUploadUrl(fileName, mimeType);
  }

  @Post("documents")
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateDocumentDto) {
    return this.documentsService.createForUser(user.sub, dto);
  }

  @Get("documents/me")
  mine(@CurrentUser() user: JwtUser) {
    return this.documentsService.listMine(user.sub);
  }

  @Roles(UserRole.ADMIN)
  @Get("admin/documents")
  adminList() {
    return this.documentsService.listForAdmin();
  }

  @Roles(UserRole.ADMIN)
  @Patch("admin/documents/:id/review")
  review(@CurrentUser() admin: JwtUser, @Param("id") id: string, @Body() dto: ReviewDocumentDto) {
    return this.documentsService.review(admin.sub, id, dto.decision, dto.reason);
  }
}
