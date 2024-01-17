# 乱七八糟的接口

暂时只写成了两个接口，后续有时间再完善

## 环境要求

需要 NodeJS 14+ 环境

## 安装

```bash
$ git clone https://github.com/luolayo/apiAll.git
$ cd apiAll
$ yarn install
```

## 运行

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## 接口文档

ApiFox共享文档：https://apiall-github.apifox.cn

先凑合着看吧有空再写文档

## 目前有的接口

1.小米运动刷步数

2.网易云音乐刷每日听歌量

3.抖音去水印

## 更新日志

<details>
<summary>点开查看</summary>

23-11-09

1、小米运动初步加了一个数据库然后写了每天18点读取数据库刷步数

2、eslint格式化了全部文件

24-01-10
重写了一下，本来打算写成用户任务类型的，定时器+数据库，后面想想还是纯写接口吧，目前也在写view

24-01-17
更新网易云音乐，添加了一些功能
</details>

## 感谢名单及调用库

（不想重复造轮子能用别人的就用别人的吧）

[Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)
