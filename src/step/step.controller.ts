import { Controller, Get, Query, Res } from '@nestjs/common';
import { StepService } from './step.service';

@Controller('step')
export class StepController {
  constructor(private readonly stepService: StepService) {
  }

  @Get()
  async getStep(@Res() res, @Query() req) {
    if (!req.user && !req.pwd) {
      return res.status(200).json({
        code: 401,
        message: '请输入用户名密码',
      });
    }
    if (!req.step) {
      return res.status(200).json({
        code: 401,
        message: '请输入步数',
      });
    }
    const result = await this.stepService.getStep(req.user, req.pwd, req.step);
    if (!result) {
      return res.status(200).json({
        code: 401,
        message: '用户名或密码错误',
      });
    }
    return res.status(200).json({
      code: 200,
      message: `成功为${req.user}修改${req.step}步`,
    });
  }
}
