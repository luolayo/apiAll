import { Controller, Get, Res } from '@nestjs/common';
import { AcgService } from './acg.service';
import { Response } from 'express';

@Controller('acg')
export class AcgController {
  constructor(private readonly acgService: AcgService) {
  }

  @Get('')
  async getImg(@Res() res: Response) {
    const text = await this.acgService.readTextFile();
    const imgText = this.acgService.formatText(text);
    const data = await this.acgService.getImg(imgText);
    return res.status(200).json({
      code: 200,
      data: `data:image/jpg;base64,${data}`,
    });
  }
}
