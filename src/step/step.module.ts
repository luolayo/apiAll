import { Module } from '@nestjs/common';
import { StepService } from './step.service';
import { StepController } from './step.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Step } from './entities/step.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Step])],
  controllers: [StepController],
  providers: [StepService],
})
export class StepModule {}
