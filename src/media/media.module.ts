import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [DrizzleModule, StorageModule],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
