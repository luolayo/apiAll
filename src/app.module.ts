import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StepModule } from './step/step.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NeteaseCloudMusicModule } from './netease-cloud-music/netease-cloud-music.module';
import { TiktokModule } from './tiktok/tiktok.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as process from 'process';
import { ConfigEnum } from './enum/config.enum';

@Module({
  imports: [
    StepModule,
    ScheduleModule.forRoot(),
    NeteaseCloudMusicModule,
    TiktokModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get(ConfigEnum.DB_TYPE),
          host: configService.get(ConfigEnum.DB_HOST),
          port: configService.get(ConfigEnum.DB_PORT) || 3306,
          username: configService.get(ConfigEnum.DB_USERNAME),
          password: configService.get(ConfigEnum.DB_PASSWORD),
          database: configService.get(ConfigEnum.DB_DATABASE),
          synchronize: configService.get(ConfigEnum.DB_SYNC) || false,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          logging: process.env.NODE_ENV === 'development' ? true : ['error'],
          autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
        } as TypeOrmModuleOptions;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
