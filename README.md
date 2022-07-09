<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## 작성시 유의 사항

1.  이유는 알 수 없지만 커스텀 데코레이터를 사용해서 user type이 admin인 계정만  
    수행 할 수 있게끔 데코레이터를
    설정 한 후에 상품 업데이트나 삭제를 할 시 "TypeORMError: Empty criteria(s)
    are not allowed for the update method." 에러가 난다.
    해결함

2.  위와 같은 이유 때문에 커스텀 데코레이터 대신 가드를 IsLoginGuard와
    IsAdminGuard 순서대로 Guard를 설정하게 되면 IsAdminGuard가 먼저 실행되고
    나서 IsLoginGuard가 실행되게 된다. 그 이유 때문에 배치를 IsAdminGuard -> IsLoginGuard로 배치를 수정했다.
    해결함 데코레이터들은 위에서 아래로가 아닌 아래에서 위로 실행되는듯함

3.  multer.config.ts에 있는 MulterOperation 클래스를 좀 더 다양한 곳에서  
    사용하기 위해 upload라는 모델을 만든 후 그 모델에서 multer.provider.ts라는  
    파일로 이전 시킨 후 multer 모듈에 provider에 넣어 주었다.

4.  그리고 멀티 미디어 파일 (사진, 동영상) 등을 처리할 수 있게끔 upload 컨트롤러에
    3가지 api를 만들었다. 각각 상품 사진 업로드, 리뷰 사진 업로드, 리뷰 동영상 업로드 등이 있다. 각 api들은 FileInterceptor(혹은 FilesInterceptor)라는 인터셉터를 거쳐야 한다. 인터셉터 인수에는 localOption이 필요로 하는데 그곳에 3. 에서 언급한 multer.provider.ts에 있는 MulterProvider 클래스를 넣으려 하였지만
    이유는 알 수 없는데 this 사용이 불가하여 DI된 MulterProvider를 인수로 넣어줄 수가 없다.
    reason: 데코레이터에는 this 사용이 불가능하다.

5.  '이미지 준비 중 입니다' 이미지를 이미지가 첨가되지 않은 상품에 사용하기 위해  
    uploads/image 디렉터리에서 fs 모듈을 이용해 해당 이미지를 읽어들이고 문자열화 하면 문자열이 깨져서 나오게 된다. 이미지 형식(png, jpg, jpeg)이라 그런듯 하다.
    image파일을 읽고 읽은 값(버퍼)으로 파일을 쓰려 했었는데 그냥 파일을 복사하는것이 낫다.

6.  인터셉터에서 res.json을 통한 응답을 하곤했었는데 그 방식이  
    포스트맨에서만  
    유효한지 웹에서 응답하게 될 때 cannot set headers 에러가 난다. 그래서 res.json 대신 return을 통한 방법으로 응답을 하려 했었는데 이유는 알 수 없지만 이 방법도 문제가 있는지 return으로 응답 한 후, 로직이 닿지 않는지 응답이 가지 않고 계속 로딩중인 상태였다. 아래 로직을 변경하니 정상작동 되었다. 방법이 맞는지는 잘 모르겠다. 해당 파일을 찾을 때 ctrl + e -> 파일 이름을 입력하자.
    파일 이름 : router-execution-context.js
    파일 경로 : node_modules/@nestjs/core/router/router-execution-context.js
    줄 : 174 ~ 177
    코드 : result = await this.responseController.transformToResult;  
     await this.responseController.apply(result, res, httpStatusCode);
    해결함 인터셉터를 여러개로 나누어 둔 후 인터셉터내에서 res객체를 사용해서 컨트롤러에서는 res, req 등을 사용하지 않게 한다.
