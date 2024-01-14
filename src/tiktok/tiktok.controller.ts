import { Body, Controller, Post, Res } from '@nestjs/common';
import { TiktokService } from './tiktok.service';
import type { Response } from 'express';

@Controller('tiktok')
export class TiktokController {
  constructor(private readonly tiktokService: TiktokService) {
  }

  @Post()
  async getTiktok(@Body('url') url: string, @Res() res: Response) {
    try {
      return res.status(200).json({
        code: 200,
        data: await this.tiktokService.getVideoUrl(url),
      });
    } catch (e) {
      const { code, message } = JSON.parse(e.message);
      return res.status(code).json({ code, message });
    }
  }
}
