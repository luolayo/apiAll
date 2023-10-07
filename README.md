## 小米运动刷步数接口

暂时只写成了一个接口，后续有时间再完善，目前写了伪装ip，目前是每次请求都会刷步数，后续写成定时任务，每天定时刷步数

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## 接口地址和参数说明

127.0.0.1:3000/step

|  参数  |   类型   |   说明   |           备注            |
|:----:|:------:|:------:|:-----------------------:|
| step | number |  刷的步数  | 1-99980多了就超出出去了，不建议超过4万 |
| user | string | 小米运动账号 | 可以是手机号也可以是邮箱，但是只能是这两种类型 |
| pwd  | string | 小米运动密码 |            无            |

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If
you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
