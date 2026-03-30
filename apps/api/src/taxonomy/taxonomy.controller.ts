import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../common/decorators/public.decorator";
import { TaxonomyService } from "./taxonomy.service";

@ApiTags("taxonomy")
@Controller("taxonomy")
export class TaxonomyController {
  constructor(private readonly taxonomyService: TaxonomyService) {}

  @Public()
  @Get("professions")
  professions() {
    return this.taxonomyService.professions();
  }

  @Public()
  @Get("specialties")
  specialties() {
    return this.taxonomyService.specialties();
  }

  @Public()
  @Get("facility-types")
  facilityTypes() {
    return this.taxonomyService.facilityTypes();
  }

  @Public()
  @Get("regions")
  regions() {
    return this.taxonomyService.regions();
  }
}
