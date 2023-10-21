import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StepModule } from './step/step.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NeteaseCloudMusicModule } from './netease-cloud-music/netease-cloud-music.module';
import { TiktokModule } from './tiktok/tiktok.module';

@Module({
  imports: [
    StepModule,
    ScheduleModule.forRoot(),
    NeteaseCloudMusicModule,
    TiktokModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
