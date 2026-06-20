import { Controller, Get } from '@nestjs/common';

@Controller('role')
export class RoleController {
  // src/place/place.controller.ts
  @Get()
  getAllPlaces(): string {
    return 'this action returns all places';
  }
}
