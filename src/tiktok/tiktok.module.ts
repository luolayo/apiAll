import { Module } from '@nestjs/common';
import { TiktokService } from './tiktok.service';
import { TiktokController } from './tiktok.controller';

@Module({
  controllers: [TiktokController],
  providers: [TiktokService],
})
export class TiktokModule {}
