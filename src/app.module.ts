import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NeteaseCloudMusicModule } from './netease-cloud-music/netease-cloud-music.module';
import { StepModule } from './step/step.module';
import { TiktokModule } from './tiktok/tiktok.module';
import { AcgModule } from './acg/acg.module';

@Module({
  imports: [NeteaseCloudMusicModule, StepModule, TiktokModule, AcgModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
