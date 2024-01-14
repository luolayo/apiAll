import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';

import { NeteaseCloudMusicService } from './netease-cloud-music.service';
import { Response } from 'express';

@Controller('netease-cloud-music')
export class NeteaseCloudMusicController {
  constructor(private readonly neteaseCloudMusicService: NeteaseCloudMusicService) {
  }

  @Post('login')
  async login(
    @Body('phone') phone: string,
    @Body('password') password: string,
    @Body('countryCode') countryCode: string = '86',
    @Res() res: Response,
  ) {
    if (!phone || !password) {
      return res.status(400).json({
        code: 400,
        message: '手机号或密码不能为空',
      });
    }
    try {
      res.status(200).json({
        code: 200,
        data: await this.neteaseCloudMusicService.cellphone_login(
          phone,
          password,
          countryCode,
        ),
      });
    } catch (err) {
      const { code, message } = JSON.parse(err.message);
      if (code === 502) {
        return res.status(200).json({
          code: 502,
          message: message,
        });
      }
      return res.status(500).json({
        code: 500,
        message: '未知错误请联系管理员',
      });
    }
  }

  @Get('qr_create')
  async qr_create(@Res() res: Response) {
    return res.status(200).json({
      code: 200,
      data: await this.neteaseCloudMusicService.qr_login(),
    });
  }

  @Get('qr_check')
  async qr_check(@Query('key') key: string, @Res() res: Response) {
    return res.status(200).json({
      code: 200,
      data: await this.neteaseCloudMusicService.qr_login_check(key),
    });
  }

  /**
   * 这玩意接口很久毕竟要刷350次 建议直接显示后台刷取即可
   * @param cookie
   * @param res
   */
  @Post('sign')
  async sign(@Body('cookie') cookie: string, @Res() res: Response) {
    if (!cookie) {
      return res.status(400).json({
        code: 400,
        message: 'cookie不能为空',
      });
    }
    res.status(200).json({
      code: 200,
      data: await this.neteaseCloudMusicService.sign(cookie),
    });
  }
}
