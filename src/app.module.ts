import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';

@Module({
  imports: [],
  controllers: [AppController, HealthController, RoleController],
  providers: [AppService, RoleService],
})
export class AppModule {}
