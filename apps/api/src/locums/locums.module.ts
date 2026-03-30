import { Module } from "@nestjs/common";
import { LocumsController } from "./locums.controller";
import { LocumsService } from "./locums.service";

@Module({
  controllers: [LocumsController],
  providers: [LocumsService],
  exports: [LocumsService],
})
export class LocumsModule {}
