import { Injectable } from '@nestjs/common';
import { get } from '../util/request';
import { VideoInfoData } from './types';

@Injectable()
export class TiktokService {
  /**
   * 检查url是否符合规则
   * @param url
   */
  checkUrl(url: string): boolean {
    const Regex: RegExp = /v\.douyin\.com\/[a-zA-Z0-9]+/;
    return Regex.test(url);
  }

  /**
   * 处理url
   * @param url
   */
  processIutput(url: string): string {
    if (!this.checkUrl(url)) throw new Error(JSON.stringify({ code: 400, message: 'url格式不正确' }));
    const Regex: RegExp = /v\.douyin\.com\/[a-zA-Z0-9]+/;
    return url.match(Regex)[0].split('/')[1];
  }

  /**
   * 获取19位视频id
   * @param str
   */
  async getVideoId(str: string): Promise<string> {
    if (!isNaN(Number(str))) {
      return str;
    }
    const url = `https://v.douyin.com/${str}/`;
    const { request } = await get('getVideoId', url);
    /*
     * 这里抖音是做了一次重定向，将短链接重定向到了长链接，axios能获取重定向后的链接所以直接拦截获取然后再正则一下就行
     * 有点麻烦-_-|| 这个链接找的好难受
     */
    const link = request.res.responseUrl;
    // 这里正则改了一下，之前只针对视频进行提取，现在图文也能提取了
    const Regex: RegExp = /share\/([a-z0-9]+)\/([0-9]+)/;
    return link.match(Regex)[2];
  }

  async getVideoInfo(video_id: string) {
    // 这玩意是抖音自己的API
    const api = `https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?reflow_source=reflow_page&item_ids=${video_id}&a_bogus=64745b2b5bdc4e75b720a9a85b19867a`;
    const res = await get<VideoInfoData>('getVideoInfo', api);
    console.log(res, api);
    const flag = res.data.item_list[0].images;
    const desc = res.data.item_list[0].desc;
    if (flag.length > 0) {
      let images = Array<string>();
      flag.forEach((item: any) => {
        images.push(item.url_list[0] as string);
      });
      return {
        desc,
        images,
        type: 'image',
      };
    }
    const uri = res.data.item_list[0].video.play_addr.uri;
    return {
      type: 'video',
      desc,
      url: `www.iesdouyin.com/aweme/v1/play/?video_id=${uri}&ratio=1080p&line=0`,
    };
  }

  async getVideoUrl(url: string) {
    if (!this.checkUrl(url)) throw new Error(JSON.stringify({ code: 400, message: 'url格式不正确' }));
    const id = this.processIutput(url);
    const video_id = await this.getVideoId(id);
    try {
      return await this.getVideoInfo(video_id);
    } catch (e) {
      throw new Error(JSON.stringify({ code: 500, message: '获取视频地址失败' }));
    }
  }
}
