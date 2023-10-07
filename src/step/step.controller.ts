import { Controller, Get } from '@nestjs/common';
import { StepService } from './step.service';
import { log } from 'console';

@Controller('step')
export class StepController {
  constructor(private readonly stepService: StepService) {
  }
  @Get()
  async getStep() {
    if (await this.stepService.getStep()) {
      return 'success';
    }
    return 'fail';
  }
}
