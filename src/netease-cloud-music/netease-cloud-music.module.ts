import { Module } from '@nestjs/common';
import { NeteaseCloudMusicService } from './netease-cloud-music.service';
import { NeteaseCloudMusicController } from './netease-cloud-music.controller';

@Module({
  controllers: [NeteaseCloudMusicController],
  providers: [NeteaseCloudMusicService],
})
export class NeteaseCloudMusicModule {
}
