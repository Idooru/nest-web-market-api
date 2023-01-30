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

1.  이유는 알 수 없지만 커스텀 데코레이터를 사용해서 user type이 admin인  
    계정만 수행 할 수 있게끔 데코레이터를 설정 한 후에 상품 업데이트나 삭제를 할 시 "TypeORMError: Empty criteria(s) are not allowed for the update method." 에러가 난다.
    해결함

2.  위와 같은 이유 때문에 커스텀 데코레이터 대신 가드를 IsLoginGuard와
    IsAdminGuard 순서대로 Guard를 설정하게 되면 IsAdminGuard가 먼저 실행되고
    나서 IsLoginGuard가 실행되게 된다. 그 이유 때문에 배치를 IsAdminGuard -> IsLoginGuard로 배치를 수정했다.
    해결함 데코레이터들은 위에서 아래로가 아닌 아래에서 위로 실행되는듯함

3.  multer.config.ts에 있는 MulterOperation 클래스를 좀 더 다양한 곳에서  
    사용하기 위해 upload라는 모델을 만든 후 그 모델에서 multer.provider.ts라는  
    파일로 변경 시킨 후 multer 모듈의 provider에 넣어 주었다.

4.  그리고 멀티 미디어 파일 (사진, 동영상) 등을 처리할 수 있게끔 upload
    컨트롤러에 3가지 api를 만들었다. 각각 상품 사진 업로드, 리뷰 사진 업로드, 리뷰 동영상 업로드 등이 있다. 각 api들은 FileInterceptor(혹은 FilesInterceptor)라는 인터셉터를 거쳐야 한다. 인터셉터 인수에는 localOption이 필요로 하는데 그곳에 3. 에서 언급한 multer.provider.ts에 있는 MulterProvider 클래스를 넣으려 하였지만
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

7.  uploadImage 함수에서 files 배열에 메서드를 사용해서 async/await을 붙인
    후 리파지토리에서 값을 받아와야 하는데 await을 붙혔는데도 불구하고 promise값을 받게 된다. files의 타입은 @UploadedFiles()데코레이터를 통해 값을 받아오게 되는데 타입은 Array<Express.Multer.File>이다.

8.  기존에는 응답 인터페이스와 인터셉터를 한가지만 사용하였지만 능동적인 응답  
    처리를 하기 위해 쿠키를 보낼 때, 쿠키를 제거 할 때, 쿠키를 사용하지 않을 때
    등을 처리하기 위해 각각 인터페이스와 인터셉터를 3개씩 사용한다.

9.  쿠키에 두 개 이상의 값을 전달할 때 배열을 사용하고 그 쿠키를 읽어들이는 @Cookies
    데코레이터와 한개의 값만 읽어들이는 @Cookie데코레이터를 만들었다. 그리고 쿠키에 한개의 값만 제거할 때와 두개 이상의 값을 제거할 때 로직을 쿠키제거 인터셉터에 나눠두었다.

10. 상품 정보등에 대한 데이터를 가져올 때 상품과 관계가 맺어진 엔티티까지 가져오기  
    위해 상품 엔티티의 관계 컬럼을 조인하고 셀렉트로 원하는 컬럼을 가져올 수 있다.
    그 중 원하는 컬럼들을 배열에 담아서 저장하였는데 각각의 배열들을 하나의 객체에 담아서 저장한다.

11. 만약 엑티브 레코드 방식을 사용해서 특정 관계가 맺어진 엔티티의 객체를 수정할  
    때 수정하기 이전에 기존에 있었던 로우를 삭제한 후 수정한 값을 저장해야 한다. 제거하지 않고 수정을 시도할 때 아이디가 겹치기 때문에 아래와 유사한 에러가 발생한다.

    "QueryFailedError: Duplicate entry '585dca54-e295-47f9-b726-29abcd4c7539' for key 'products_images.REL_7378beebe3320f7e6fe5bb3145'"

    보통 A와 B가 어떠한 관계가 맺어졌다 가정할 때 B쪽에 외래키 컬럼이 있다 가정하고 B에 대한 객체를 생성후 A에 대한 객체를 생성시 B의 외래키 컬럼에 A의
    아이디가 저장된다. 이처럼 A를 수정하면서 B까지 수정할 일이 생길 때 (예를 들면
    상품 생성후 같이 생성된 이미지를 수정할 시) 이전에 있던 B의 외래키 컬럼에는 A의
    아이디가 남아있게 된다. 따라서 남아 있던 A의 아이디를 지우지 않고 B의 로우에 값을 추가하게 될 때 기존에 있던 B의 외래키(A의 id)가 두 개가 되면서 에러가 발생하게 된다. 엑티브 레코드(active record) 방식을 사용하여 로우를 수정하는 방식이 아닌 아예 새로운 객체를 만들고 저장하는 방식은 위의 상황에 유의한다. 리파지토리 패턴으로 update혹은 쿼리빌더를 사용해 수정할 경우, 로우를 새로 생성하는 방식은 아니므로 예외이다.

12. Promise.AllSettled안에 한번 더 Promise.AllSettled를 호출하게 될 때 첫  
    번째 Promise.AllSettled가 호출 될 때 에러와 두 번째 Promise.AllSettled가 호출 될 때 에러가 혼합 되어 exception filter에 나타나게 된다. 따라서 이를
    Promise.AllSettled를 한 번만 사용할 때와 위처럼 중첩되게 사용할 때를 구분하여야 한다. 만약 중첩되게 사용할 때 에러가 발생하게 된다면 err.message 배열 인덱스 중 reason 프로퍼티에 InternalServerErrorException으로 나타나게 될 것이다. reason 프로퍼티에 InternalServerErrorException 유무를
    구별하는것이 Promise.AllSettled를 한번 사용하였는지 아니면 중첩해서 사용하였
    는지를 구별짓는 방법이 될것이다.
    문제는 따로 메서드를 만든 후, err.message배열에서 배열 메서드를 사용한 후 idx 매개변수를 이용해 접근해보려 했지만 idx 변수에 타입을 주지 않으면 idx.reason에 접근이 불가능해진다. idx에 정확한 타입을 주어야 할거 같다.

13. cascade 해결
14. UserEntity에서 원하는 정보만 쿼리빌더를 사용해서 빼오기 해결
15. 전체 사용자가 사용할 수 있는 api 컨트롤러를 free-use와 only-admin으로 나눠 보았다. 아직은 Product 도메인만 적용되었지만 나중에 모든 도메인에 적용해볼것이다.
16. jwt 인증 로직 기능 중 access token과 refresh token을 나누어 사용해 보았다. 주요 인증 기능인 access token의 유효 시간을 짧게 한 후, 유효 시간이 초과되었을 때 access token과 refresh token을 다시 발급 하여 사용할 수 있게 하였다. 이렇게 되면 access token이 탈취 되었다고 가정할 때 refresh token만큼은 잘 간직하고 있다가 refresh token API를 호출할 때 키로 사용하여 토큰을 다시 복구할 수 있게 된다. 만약 refresh token 마저 탈취 되면 답이 없을 거 같다.
