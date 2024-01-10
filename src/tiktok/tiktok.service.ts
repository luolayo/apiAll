import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TiktokService {
  /**
   * 处理url
   * @param url
   */
  processIutput(url: string): string {
    if (!this.checkUrl(url))
      throw new Error(JSON.stringify({ code: 400, message: 'url格式不正确' }));
    const Regex: RegExp = /v\.douyin\.com\/[a-zA-Z0-9]+/;
    return url.match(Regex)[0].split('/')[1];
  }

  /**
   * 检查url是否符合规则
   * @param url
   */
  checkUrl(url: string): boolean {
    const Regex: RegExp = /v\.douyin\.com\/[a-zA-Z0-9]+/;
    return Regex.test(url);
  }

  async getVideoInfo(video_id: string) {
    // 这玩意是抖音自己的API
    const api = `https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?reflow_source=reflow_page&item_ids=${video_id}&a_bogus=64745b2b5bdc4e75b720a9a85b19867a`;
    const res = await this.request(api, 'GET', {});
    console.log(res, api);
    const flag = res.data.item_list[0].images;
    const desc = res.data.item_list[0].desc;
    if (flag.length > 0) {
      const images = Array<string>();
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

  /**
   * 获取19位视频id
   * @param str
   */
  async getVideoId(str: string): Promise<string> {
    if (!isNaN(Number(str))) {
      return str;
    }
    const url = `https://v.douyin.com/${str}/`;
    const { request } = await this.request(url, 'GET', {});
    /*
     * 这里抖音是做了一次重定向，将短链接重定向到了长链接，axios能获取重定向后的链接所以直接拦截获取然后再正则一下就行
     * 有点麻烦-_-|| 这个链接找的好难受
     */
    const link = request.res.responseUrl;
    // 这里正则改了一下，之前只针对视频进行提取，现在图文也能提取了
    const Regex: RegExp = /share\/([a-z0-9]+)\/([0-9]+)/;
    return link.match(Regex)[2];
  }

  async getVideoUrl(url: string) {
    if (!this.checkUrl(url))
      throw new Error(JSON.stringify({ code: 400, message: 'url格式不正确' }));
    const id = this.processIutput(url);
    const video_id = await this.getVideoId(id);
    try {
      return await this.getVideoInfo(video_id);
    } catch (e) {
      throw new Error(
        JSON.stringify({ code: 500, message: '获取视频地址失败' }),
      );
    }
  }

  private async request(
    url: string,
    method: string,
    data: any,
    headers: any = false,
  ) {
    const default_headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2',
    };
    return axios({
      url,
      method,
      headers: headers ? headers : default_headers,
      data: new URLSearchParams(data),
      maxRedirects: 5,
    });
  }
}
