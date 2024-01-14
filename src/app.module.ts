import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NeteaseCloudMusicModule } from './netease-cloud-music/netease-cloud-music.module';
import { StepModule } from './step/step.module';

@Module({
  imports: [NeteaseCloudMusicModule, StepModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
