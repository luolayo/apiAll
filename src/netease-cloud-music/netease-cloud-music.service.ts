import { Injectable } from '@nestjs/common';
import {
  login_cellphone,
  login_qr_check,
  login_qr_create,
  login_qr_key,
  personalized,
  playlist_detail,
  scrobble,
} from 'NeteaseCloudMusicApi';

/**
 * 网易云音乐刷打卡歌曲
 * 使用NeteaseCloudMusicApi
 * https://binaryify.github.io/NeteaseCloudMusicApi/#/
 */
@Injectable()
export class NeteaseCloudMusicService {
  /**
   * 手机号登录
   * 请勿短时间多次调用，否则会被网易云封禁
   * @param phone 手机号
   * @param password 密码
   * @param countryCode 国家码，用于国外手机号登录，例如美国传入：1
   */
  async cellphone_login(phone: string, password: string, countryCode: string) {
    const { body: res } = await login_cellphone({
      phone,
      password,
      countrycode: countryCode,
    });
    if (res.code !== 200) {
      throw new Error(JSON.stringify(res));
    }
    return res.cookie;
  }

  /**
   * 二维码登录
   * 这玩意过期的很快，轮询检查二维码是否登录
   */
  async qr_login() {
    const { body: res } = await login_qr_key({});
    if (res.code !== 200) {
      throw new Error(res.message.toString());
    }
    const { unikey } = res.data as { code: number; unikey: string };
    const { body: res2 } = await login_qr_create({ key: unikey, qrimg: true });
    if (res2.code !== 200) {
      throw new Error(res2.message.toString());
    }
    const { qrimg } = res2.data as {
      code: number;
      unikey: string;
      qrimg: string;
    };
    console.log(unikey);
    return {
      key: unikey,
      qrimg: qrimg,
    };
  }

  /**
   * 检查二维码是否登录
   * @param key
   */
  async qr_login_check(key: string) {
    console.log(key);
    const { body: res } = await login_qr_check({ key });
    return res;
  }

  /**
   * 获取推荐歌单
   * @param cookie
   */
  async playlist(cookie: string) {
    return await personalized({
      cookie,
      limit: 1000,
    });
  }

  /**
   * 刷听歌数量
   * 会自动获取推荐歌单，然后遍历歌单中的歌曲，刷听歌数量
   * 没有分离出来写的也很迷 等我有空分离出来并且刷用户的歌单
   * @param cookie
   */
  async sign(cookie: string) {
    let count = 0; // 签到次数
    const res = await this.playlist(cookie);
    for (const item of res.body.result as Array<{ id: string }>) {
      const id = item.id;
      const res2 = await playlist_detail({
        id,
        cookie,
      });
      const playlist = res2.body.playlist as { tracks: Array<{ id: string }> };
      for (const track of playlist.tracks) {
        await scrobble({
          id: track.id,
          sourceid: id,
          time: 61,
          cookie,
        });
        ++count;
      }
      if (count > 1000) {
        break;
      }
    }
    return count;
  }
}
