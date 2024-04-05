import { Injectable } from '@nestjs/common';
import {
  login_cellphone,
  login_qr_check,
  login_qr_create,
  login_qr_key,
  login_refresh,
  personalized,
  playlist_detail,
  scrobble,
  user_account,
} from 'NeteaseCloudMusicApi';
import { MusicData } from './typs';

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
    const { body } = await login_cellphone({
      phone,
      password,
      countrycode: countryCode,
    });
    const res: MusicData = body as unknown as MusicData;
    if (res.code !== 200) {
      throw new Error(JSON.stringify(res));
    }
    return {
      cookie: res.cookie,
      id: res.account.id,
      nickname: res.profile.nickname,
      avatarUrl: res.profile.avatarUrl,
    };
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
  async refresh(cookie: string) {
    const res = await login_refresh({ cookie });
    return res;
  }

  /**
   * 获取用户信息
   * @param cookie {string}
   */
  async getUserInfo(cookie: string) {
    const { body } = await user_account({ cookie });
    const res = body as unknown as MusicData;
    if (res.code !== 200) {
      throw new Error(JSON.stringify(res));
    }
    return {
      cookie: res.cookie,
      id: res.account.id,
      nickname: res.profile.nickname,
      avatarUrl: res.profile.avatarUrl,
    };
  }

  /**
   * 固定用户刷音乐量
   *
   */

  async userSign() {
    const cookie = 'NMTID=00O92gC7UgP-pPTNU2OmIWOcKsQSpEAAAGOriEXwg; Max-Age=315360000; Expires=Mon, 03 Apr 2034 11:59:48 GMT; Path=/;;MUSIC_A_T=1489212237220; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/api/feedback;;MUSIC_R_T=1489212304246; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/api/feedback;;MUSIC_A_T=1489212237220; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/eapi/clientlog;;MUSIC_R_T=1489212304246; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/eapi/clientlog;;MUSIC_U=00761B2CBD8CEA8DBC41CD3820EAF807D6CD450CB110D188648D81A54F5ADC6FA4BA6FAA70955F7FFC5948FE98C09F53104896412C91EAD157225C15F0564CD37595A8C818E9507A3E5D333ACF431B8752781549CB4A75E805A1F210DCEE35EFA34930425597F1B50AFFEF96E4E01D0BF522B76D8FAD7A0DB59027901FD565375EF16C21EC1CDDFC8C59B4209F633C19C57A50C4171EE4B7DA85E0CC699C9CA4D8656724141CFE4DE78E61638DDAE1EFE24CBA677459487111D546442878D0EF36FA0D9BCA9643A44983314D2515C7D8812D288F7E165B54B0E9DFE636EA6C076CC5D81E4B2580EFBD38FF3953DBE0A2E1F52A03EDEDDDBBAA0531887AB012CC74C88D1420658EFF72694DE1E21DDC13B77DBE54F4456E445158C1E8B248AC7C8BA72F02EED083F0F56D8A1EE45B974641D7CEC052C32E8D2A62F0889FF212B06C3B63DFEF25492CE1920EDDEB38C9B4BE; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/;;MUSIC_A_T=1489212237220; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/neapi/feedback;;__csrf=f2d01f8b26fa70c1fb32fc442fa75f10; Max-Age=1296010; Expires=Sat, 20 Apr 2024 11:59:58 GMT; Path=/;;MUSIC_A_T=1489212237220; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/neapi/clientlog;;MUSIC_SNS=; Max-Age=0; Expires=Fri, 05 Apr 2024 11:59:48 GMT; Path=/;MUSIC_R_T=1489212304246; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/openapi/clientlog;;MUSIC_A_T=1489212237220; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/api/clientlog;;MUSIC_A_T=1489212237220; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/weapi/feedback;;MUSIC_A_T=1489212237220; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/weapi/clientlog;;MUSIC_A_T=1489212237220; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/wapi/clientlog;;MUSIC_R_T=1489212304246; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/wapi/clientlog;;MUSIC_R_T=1489212304246; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/neapi/feedback;;MUSIC_A_T=1489212237220; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/eapi/feedback;;MUSIC_R_T=1489212304246; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/wapi/feedback;;MUSIC_R_T=1489212304246; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/weapi/feedback;;MUSIC_A_T=1489212237220; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/openapi/clientlog;;MUSIC_R_T=1489212304246; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/eapi/feedback;;__remember_me=true; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/;;MUSIC_A_T=1489212237220; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/wapi/feedback;;MUSIC_R_T=1489212304246; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/api/clientlog;;MUSIC_R_T=1489212304246; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/neapi/clientlog;;MUSIC_R_T=1489212304246; Max-Age=2147483647; Expires=Wed, 23 Apr 2092 15:13:55 GMT; Path=/weapi/clientlog;';
    const count = await this.sign(cookie);
    return count;
  }
}
