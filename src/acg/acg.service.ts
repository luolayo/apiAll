import { Injectable } from '@nestjs/common';
import sintxt from './sintxt.json';
import axios from 'axios';


@Injectable()
export class AcgService {
  /**
   * 读取文件
   * @return string
   */
  async readTextFile(): Promise<string[]> {
    return sintxt;
  }

  /**
   * 从读取的文件中读取一条图片数据并删除多余换行符
   * @param text
   * @return string
   */
  formatText(text: string[]): string {
    const index = Math.floor(Math.random() * text.length);
    const img = text[index].replace(/(\n|\r|\r\n|↵)/g, '');
    return img;
  }

  /**
   * 获取图片，并且将图片转换为base64
   */
  async getImg(text: string) {
    const imgData = await axios.get(text, {
      responseType: 'arraybuffer',
      headers: {
        'referer': 'https://www.weibo.com',
      },
    });
    const img = Buffer.from(imgData.data).toString('base64');
    return img;
  }
}
