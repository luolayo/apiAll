import { Module } from '@nestjs/common';
import { AcgService } from './acg.service';
import { AcgController } from './acg.controller';

@Module({
  controllers: [AcgController],
  providers: [AcgService],
})
export class AcgModule {}
