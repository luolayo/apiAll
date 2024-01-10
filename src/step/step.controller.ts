import { Body, Controller, Post, Res } from '@nestjs/common';
import { StepService } from './step.service';
import { Response } from 'express';

@Controller('step')
export class StepController {
  constructor(private readonly stepService: StepService) {}

  @Post()
  async getStep(
    @Res() res: Response,
    @Body('user') user: string,
    @Body('pwd') pwd: string,
    @Body('step') step: string,
  ) {
    if (!user && !pwd) {
      return res.status(200).json({
        code: 401,
        message: '请输入用户名密码',
      });
    }
    if (!step) {
      return res.status(200).json({
        code: 401,
        message: '请输入步数',
      });
    }
    if (Number(step) > 99980 || Number(step) < 1) {
      return res.status(200).json({
        code: 401,
        message: '请输入1~99980之间的步数',
      });
    }
    const result = await this.stepService.getStep(user, pwd, step);
    if (!result) {
      return res.status(200).json({
        code: 401,
        message: '用户名或密码错误',
      });
    }
    return res.status(200).json({
      code: 200,
      message: `成功为${user}修改${step}步`,
    });
  }
}
