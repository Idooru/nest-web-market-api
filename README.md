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

## 프로젝트 진행 회고

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

17. 각 도메인 마다 general과 verify 컨트롤러, 서비스, 리파지토리 등을 추가했다. 기존에는 general(여태 사용되었던 기본적인 컨트롤러, 서비스, 리파지토리)에서 수행되어야 할 검증과 기능이 공존했다면 이제는 이를 분리하여 사용하도록 했다. 이를 분리함으로서 나름 SRP(Single Responsibility Principle)를 준수하게 된거 같다. verify 컴포넌트의 존재 이유는 데이터베이스 작업을 할 때 각 entity에 unique 옵션이 달린 컬럼이 존재 할 시, 이를 확인 하지 않고 작업을 수행하다가 duplicate 에러가 날 확률이 존재한다. 이 확률을 최대한 줄이기 위해서 먼저 verify 컴포넌트 로직을 거치게 된 후, general 컴포넌트 작업을 거치도록 한다. (하지만 이것 역시 완벽하진 않다. 왜냐하면 verify 컴포넌트를 통해서 해당 컬럼에 해당되는 값을 검증한다 해도 general 컴포넌트 작업에서 이전에 검증된 값을 사용하지 않는다면(예를 들어 사용자 닉네임으로 데이터베이스에 존재하지 않는 UserA라는 닉네임을 검증 받은 후, general 컴포넌트에서 데이터베이스에 존재하는 UserB라는 닉네임으로 작업을 하게 될 때), 결국 데이터베이스에 존재하게 된 값을 사용하게 됨으로 이는 프론트엔드에서 요청을 적절히 수행해야 한다.) 수정: 컨트롤러를 통해서 필드를 유효성 검사하는 방식이 아닌 각 필드를 받아오는 body, param, query등의 데코레이터에 pipe를 등록하는 식으로 변경하였다.

18. PromiseLibrary 기능을 사용 중지할 계획이다. 기존에는 여러 개의 프로미스를 처리할 상황이 생기게 된다면 우선 Promise.allSettled() 메서드에 인자로 프로미스를 반환하는 메서드를 넣고 그 반환값을 PromiseProcessor 클래스의 처리 메서드(twoPromiseSettled, threePromiseSettled 등)에 넣고 호출하게 되면 Settled 타입의 값을 내가 원하는 값(PromiseSettledResult가 아닌 동기적인 값(표현이 어색하지만 딱히 표현할 방도를 몰라 이렇게 표현하였다.))을 얻을 수 있게 되었다. 만일 여기서 처리 도중 에러가 나게 된다면 PromiseHandleException을 던지게 되고 이 던져진 예외를 PromiseExceptionFilter가 이 예외를 처리하게 되는 방식이다. 하지만 이는 너무 복잡한 방식이며 나중에 이런 과정을 거치지 않고 더 편리하게 다수의 프로미스 반환 메서드를 처리할 방법을 알아 내게 되었다. Promise.allSettled()대신 Promise.all()을 사용하는 것이다. Promise.all을 사용하게 되면 우선적으로 반환값이 PromiseSettledResult 타입을 갖지 않고 동기적인 값을 얻을 수 있게 된다. 두 번째로 만약 프로미스를 반환하는 메서드를 처리하다 에러가 났을 시 Promise.allSettled()메서드는 실패가 했을 시에도 우선 PromiseRejectedResult 타입으로 값을 가지게된다. 하지만 Promise.all()을 사용할 때는 이 메서드의 인자로 실패 할 거 같은 프로미스를 반환하는 메서드를 주게 될 떄 프로미스를 반환하는 메서드 내부에 try catch 로 감싼 후 그 내부 로직안에서 프로미스 예외가 나게 된다면 catch가 그 예외를 잡을 것이고 잡혀진 예외를 다시 HttpException으로 던지면 다시 이를 HttpFilter가 캐치하여 클라이언트에게 응답으로 요청에 대한 실패를 응답으로 보낼 수 있게 된다. 이는 백엔드쪽에서 유용하게 사용될 거 같은 이유가 Promise.allSettled와는 달리 Promise.all은 하나만 실패해도 전부 실패처리가 되게 한다. 이를 통해 데이터 처리가 엄격해야 할 경우에 좋게 사용될거 같다. 만약에 A라는 다중 프로미스 처리가 있고 이 결과를 이용해 B라는 다른 로직을 수행해야 할 상황이 생길 때 A에서 하나는 성공했는데 다른게 성공안됐다고 이를 묵인해버린다면 별로 좋지 않은 상황이 생길거 같다. 마지막으로 궁극적인 이유가 Promise.allSettled를 사용할 시 위에서도 언급했지만 성공 혹은 실패를 결과값으로 PromiseSettledResult 혹은 PromiseRejectedResult 두개로 받을 수 있다. 여기서 원하는 동기적인 값을 얻으려면 PromiseProcessor 처럼 약간 복잡한 로직을 거치게 된다. 이러면 런타임에도 좋지 않을 거 처럼 생각이 되었고 응답 시간이 늦춰질 거라 생각이 되어 아쉽지만 PromiseLibrary는 파기 해야 할 거 같다. 나중을 위해 아예 파일 삭제를 하는 대신 src/deprecated이라는 디렉터리에 저장해 놓을 계획이다. 대안 방안: Promise.all을 사용하여 여러 개의 프로미스를 처리하게 될 때 간혹 실패된 프로미스를 여러개 받아서 응답으로 보내야 하는 상황이 있다. ex) 회원가입을 하게 될 떄, 기존 사용자가 사용하는 전화번호, 이메일, 닉네임등 두개 이상이 겹치게 되면 각 필드 별로 duplicated exception이 발생하게 된다. 이런 상황에서 Promise.all을 사용하게 되면 Promise.all은 병렬적인 특성으로 내부 인자(프로미스 함수)들을 처리하게 된다. 순서가 보장이 되지 않다는 뜻이다. 그리고 내부 인자에서 에러가 발생하게 된다면 만약 에러가 두개 발생되는 상황에서 에러가 한개만 발생하게 된다. 즉 여러에러를 동시에 처리하지 못하게 된다. 이런 점에 있어서 두 개 이상에 프로미스를 처리할 때 무조건적으로 Promise.all을 사용하는것이 아닌 Promise.allSettled를 선택을 해야 한다. 대안 방안 이전엔 내가 생각이 짧아서 간단하게 Promise.allSettled에서 발생한 에러를 여러 개 처리할 수 있었음에도 불구하고 굳이 PromiseLibrary를 사용함으로써 성능과 코드 가독성등을 떯어뜨리게 된 것 같다. 일단 시범적으로 ModifyUserValidationPipe라는 클래스에서 사용자 필드에 대한 유효성 검사를 진행하게 될 때 Promise.allSettled를 사용하여 프로미스 결괏갑이 담긴 배열을 생성하고 filter() 배열 메서드를 통해서 프로미스 status가 'rejected'인 것만 따로 배열로 반환한다. 그리고 rejected를 담은 배열의 길이가 존재한다면 그건 다수의 프로미스를 처리하다 에러가 발생한것으로 간주하게 되고 HttpException에 에러 배열을 담고 보냄으로써 이제 클라이언트에게 하나의 에러만을 알리는것이 아닌 두개 이상의 에러를 알릴 수 있게 되었다.

19. 이전에 typeorm 옵션중인 synchronize를 true로 했을 시, 잘 안되는 경향(애플리케이션을 실행할 수 없던 상태) 이 있었는데 database키의 값을 사용하던 데이터베이스 스키마의 이름을 소문자로 하였더니 적용이 잘 되었다. 참고하자.

20. GPT의 도움으로 Validation Exception, 즉 예외 처리할 때 발생하게 될 예외를 커스텀 할 수 있게 되었다. 그리고 내가 이전에 만들어 두었던 Validation Filter에서 @Catch() 데코레이터에 ValidationException을 적용하였는데 문제는 컨트롤러에서 유효성 검사를 하게 되고 유효성 검사에 실패하였을 때 throw new ValidationException()으로 유효성 검사 예외를 던질 때 발생하였다. 그 문제는 ValidationException 클래스 안에서 발생하게 되었는데 ValidationException 클래스는 HttpException을 커스텀해서, 즉 래핑(상속)을 함으로써 만들어진 HttpException의 super set으로 보면 적절할 거 같다. 이렇게 만들어진 ValidationException을 ValidationExceptionFilter에서 걸러지게 해야 하는데 이 과정에서 "RangeError: Invalid status code: undefined" 이런 에러가 나와서 당혹쓰러웠다. (이 에러는 nestjs에서 자체적으로 잡아주지 못하기(catch할 수 없기) 때문에 에러가 터지면 서버가 가버린다. 조심하자.) 이 문제는 이 앱에서 사용되는 두개의 필터를 컨트롤러에서 사용하는것이 아닌 앱 전체에서 사용하기 위해 useGlobalFilters에 적용시켜두었는데 이 필터의 순서를 위에서 아래로 본다고 가정할 때, HttpExceptionFilter -> ValidationExceptionFilter 이 순서로 적용을 해야 했다. 이전에도 이런 비슷한 상황의 유의 사항을 작성한 적이 있었는데 filter, interceptor, pipe등등 nestjs에서 제공되는 기능들은 보통의 코드와 다르게 밑에서 부터(들여쓰기가 되지 않는다면 오른쪽부터)위로 이런 요소들이 적용되는 것으로 보인다. 정확한 원리는 모르겠지만 이런식으로하니 해결이 되었다.

21. 관리자 (혹은 고객) 사용자의 프로필 정보를 가져오는 쿼리에서 Admin 엔티티의 모든 컬럼(Admin의 아이디를 제외한 모든 컬럼)을 가져오지 않기 위해 select 리스트에서 Admin을 통째로 select하지 않고 Admin.createdProduct, Admin.writtenInquiryResponse으로 필드를 select하려했지만 QueryFailedError: Unknown column 'Admin.createdProduct' in 'field list' 이런 에러가 던져지게 되었다. 아쉬운대로 adminActions.id에 null을 대입하여 임시방편으로 처리한다.

22. 미디어 파일을 업로드하는 컨트롤러에서 여러 개의 미디어 파일을 업로드한다고 가정할 때 만약 업로드할 파일들의 이름이 모두 동일하다면 파일의 이름으로 url을 생성하고 이를 데이터베이스에 적재하는 과정에서 duplicated 에러가 발생하게 된다. 아직 프론트엔드가 확립되진 않았지만 이 문제를 해결하려면 프론트엔드 쪽에서 파일의 이름을 검증할 필요가 있다. 현재로서는 이런 api를 테스트할 때 같은 이름의 미디어 파일을 여러개 업로드 하는 행위는 하지 않도록한다.

23. 기존에는 트랜잭션에 대한 개념을 인지하지 못하여서 데이터베이스 처리 로직을 일관적으로 하나의 리파지토리, 서비스 레이어에서 이를 처리하도록 했다. 트랜잭션을 이해하게 됨으로써 순차적으로 데이터베이스 로직을 실행할 필요가 있는 서비스 로직은 typeorm에서 제공하는 queryRunner로 감싸서 시작과 끝을 구분하였고 내부에 try catch문을 사용해서 try에서 서비스 레이어 메서드를 호출하게 되고 catch에서 queryRunner.rollbackTransaction() 메서드를 호출함으로써 queryRunner에서 생성된 리파지토리에서 이루어졌던 데이터베이스 로직을 실행하였던 것을 모두 rollback(되돌림)이 가능해졌다. 이를 통해 여러 횟수의 데이터베이스 로직을 순차적으로 처리했을 때 안정성을 증가시키게 되었다. 회원, 상품, 리뷰, 문의 등을 생성하거나 수정할 시 여러 횟수의 데이터베이스 로직을 실행하는데 이제는 처리 중간에 문제(에러)가 발생할 시 기존 실행 이력(쿼리가 커밋됨으로써 발생된 부수 효과)이 잔존하지 않게 되었다. 그리고 트랜잭션이 사용되어야 하는 기준은 나는 데이터베이스에서 데이터가 변형되는 행위로 정의 하였고 이는 이떻게 보면 select를 제외한 나머지 DML(Data Manipulation Language) 쿼리라고 생각한다. 물론 이는 나를 포함한 모두가 이렇게 생각할 것이다. 그래서 나는 데이터베이스에서 발생되는 로직을 찾는 행위와 조작하는 행위로 구분하여 Searcher, Operation 레이어를 발명하였다. 트랜잭션 클래스에 있는 메서드를 보면 try문 안에서 데이터베이스 조작 행위가 일어나게 되는데 이 부분에서는 operation서비스의 메서드를 호출하게 된다. (필요에 따라서 function서비스의 메서드를 호출 할 수 있다.) try문에서 데이터베이스 조작 행위를 수행하기 전에 Searcher를 통해서 필요한 엔티티를 불러오는 작업을 수행하게 된다. search 리파지토리 레이어와 operation 리파지토리 레이어에는 리파지토리가 의존성 주입이 되어있는데 이는 각 리파지토리는 성격이 다르다. search 리파지토리 레이어에는 typeorm에서 제공되는 순수 Repository 클래스를 사용하지만 operation 리파지토리 레이어에는 Init 클래스에서 생성한 queryRunner와 Repository 클래스 둘 다 사용한다. queryRunner에서 사용되는 리파지토리는 트랜잭션을 통해 실행되는 리파지토리이고 Repository클래스에서 사용되는 리파지토리는 데이터를 조작하기는 하나 조작하는 행위가 단 한번만 실행되는 로직만 Repository클래스에서 사용한다. 이를 확실히 분리함으로써 데이터베이스 로직 횟수를 줄일 수 있었고 코드 역시 획일성 있는 코드로 바꿀 수 있게 되었다.

24. restful api를 준수하기 위해서 api uri에 들어갈 문자열에서 오직 명사만 사용하게 하였다. ex) /only-client, /free-use -> /client, /

25. UserSecurity 클래스에서 로그인 인증을 완료한 후, 인증이 성공되면 refreshtoken을 해당 인증이 완료된 사용자의 user_auth 테이블에 refreshToken을 저장시키려 하였다. UserUpdateService 클래스의 저장 메서드를 사용하기 위해서 의존성 주입을 시도하였는데 어째서 인지 "Nest can't resolve dependencies of the"에러가 발생하였다. UserModule 클래스에서는 두 클래스 모두 providers 배열에 잘 있는 상태였지만 원인을 해결할 수 없었다. 알고보니 두 클래스가 서로 순환 참조를 하였기 때문이었다. 이전에 nestjs모듈간에 순환참조가 이루어지면 forwardRef함수를 호출하고 인수로 () => "순환 참조 대상 모듈" 이런식으로 하면 해결되었다. 의존성 주입 역시 비슷하다. @Inject(forwardRef(() => "순환 참조 대상 클래스"))를 생성자 필드 앞에 붙혀두니 해결되었다.

26. 기존에는 트랜잭션을 구현하기 위해서 queryRunner 인스턴스를 만들고 인스턴스 내부에 있는 리파지토리를 만들어서 각 도메인의 repository vo 라는 클래스 내부에서 리파지토리 필드를 관리하였다. update repository 클래스에서 트랜잭션에서 사용되는 리파지토리가 필요하다면 reposiory vo 클래스를 nestjs에 DI 컨테이너에 넣어서 (module 클래스의 provider 배열에 넣음) update repository에서 의존성 주입을 통해 사용하였다. 이 방법에는 3개의 클래스가 필요하게 된다. TO DO에서 작성한 6번을 수행하는 도중에 반복되는 메서드를 인터페이스로 묶어서 DIP를 구현하려다가 문득 query runner provider 클래스에서 repository vo를 초기화 시키고 그걸 update repository에서 사용할 필요가 있을까? 라고 생각을 하다가 repository vo 클래스를 없애고 query-runner-provider 내부에서 트랜잭션 리파지토리 초기화, 접근을 하는 메서드를 만들고 query-runner-provider에서 중복되는 메서드를 인터페이스로 묶어서 사용한다면 DIP라는 객체지향 개념을 고수하면서 불필요한 클래스(repository vo)도 줄이게되고 update repository에서도 더 깔끔한 인터페이스를 갖게 되었다. 객체지향 개념은 위대하다.

27. 트랜잭션 작업 코드의 가독성을 향상 시키기 위해서 TransactionExecutor, TransactionSearcher, TransactionContext로 클래스를 세분화 시켰다. 가독성을 지키며, SRP 원칙을 고수하고 TO DO에서 작성한 8번과 시너지를 발휘하게 되었다. 프로미스 함수를 반환하여 then, catch, finally를 붙히기 수월한 형태로 바뀌었다.

28. 로직 별로 필요한 데코레이터를 만들어 봐서 각 메서드에 적용을 시켜보았다. service 혹은 repository 레이어에서 트랜잭션 로직 콜스택 내부에서 호출하는 메서드는 @Transaction 데코레이터를 그 이외의 로직에는 @General을 붙혔다. 그리고 인터페이스에서 구현하는 메서드는 @Implemented 데코레이터를 붙혔다. (해당 데코레이터들은 별 다른 기능은 하지 않는다. 그저 시각적으로 구별하기 위해 붙혔다.)

29. 27번에서 언급한 then, catch, finally는 모종의 문제로 catch 메서드로 에러 핸들링이 되지 않아 다시 try catch finally 문으로 원복시켰다.
30. 회원가입, 문의 요청과 응답, db내부에 있는 미디어 파일 url 삭제시 실제 디스크(uploads 폴더)에 있는 파일을 제거 하는 작업등은 생각 보다 latency가 오래 걸리는 작업들이다. 이는 동기적으로 진행을 하게 된다면 응답을 기다리는 사용자에게 꾀나 큰 UX 감소를 지향한다. 이를 해결하기 위해서 해당 작업등을 해당 API에 
    Interceptor를 추가하여 res.on("finish")이벤트를 등록한 후 해당 이벤트가 trigger 되었을 때 해당 작업등을 실행하게 두면 사용자는 응답을 받기 위해 오랜 시간을 기다릴 필요 없이 쾌적한 사용이 가능해진다.  
    기존에 middleware를 통한 유사한 구조가 있었지만 모종의 이유로 인해 해당 middleware를 등록한 route에 접근이 되었음에도 middleware를 호출할 수 없는 문제가 발생하여 이를 Interceptor로 교체하였다.
31. TO DO 항목에도 명시해 놓았지만 TO DO 16번 까지 진행 이후 해당 프로젝트의 API를 플러터로 앱 개발 이후 연동 작업을 거칠 것이다. 문제는 지금 백엔드 API에서 일부는 쿠키를 사용하고 있다는 점인데 앱 환경에서는 쿠키 연동이 되지 않으므로 인증 작업, 토큰 재발급, 미디어 파일 업로드 작업등을 쿠키에서 http header를 
    사용하는 방식으로 전환이 필요하다.
32. 상품을 생성할 때 상품 이미지를 상품이 생서될 때 같이 포함 시키기 위해서 상품 이미지 업로드 api를 매번 호출 해야 하는 번거로움이 있었다. 이를 해결하기 위해서 productImgCookies 배열의 길이가 0일 때 에러를 던지지 않고 default image를 삽입하는 식으로 변경을 시도하였다. 우선 
    uploads/images/product 폴더에 default_product_image.jpg 라는 파일을 저장시킨다. 그 다음 productImgCookies 배열의 길이가 0일 때 앞서 저장 시킨 파일이름에 Date.now()를 호출한 값을 파일 이름과 확장자 사이에 삽입시킨다. 이유는 데이터베이스에 업로드한 파일의 url을 저장시켜야 
    하는데 해당 컬럼이 unique가 걸려있기 때문에 같은 url이 여러개 저장 될 수 없는 상황이기 때문이다. 이렇게 하면 데이터베이스에 상품을 생성하고 상품에 이미지 역시 default image가 들어가게 되지만 실제 업로드된 파일(데이터베이스가 아닌 uploads 폴더에 저장된 파일)은 데이터베이스에 저장된 파일 이름과 일치하지 않다. 
    이유는 이전에 uploads 폴더에 저장된 파일 이미지에 Date.now()를 삽입 시켜서 저장 했기 때문에 파일 이름이 서로 일치하지 않게 된다. 그렇기 때문에 이런 방식으로 저장된 파일 이미지는 실제로 서빙 되지 않기 때문에 좋지 않다. 그렇다고 url을 저장하는 컬럼의 unique를 해제하게 되면 저장되는 url이 중복 될 수 있기 
    때문에 이 방법 역시 좋지 않은거 같다. 
33. 기본 상품 이미지를 데이터베이스에 row로 만들어 상품과 조인 관계를 맺는 방법은 힘들어 보인다. 결국 다른 방법을 생각 해봤는데 상품을 가져오는것과 관련된 api에서 상품 이미지가 없을 경우 uploads 폴더에 저장된 파일을 넣어주는 것이다. 이 방법을 선택하면 상품을 생성할 때마다 따로 상품 이미지 row를 만들어 상품과 조인 관계를 
    맺을 필요가 없게 된다. 이 부분에 있어 상품을 생성할 때는 DB 성능을 높일 수 있게 된다. 다만 단점으로는 이제 상품을 가져오는 쿼리에서 상품 이미지와 조인을 할 때 inner join 대신 left join을 사용해야 한다. inner join은 자식이 부모의 외래키를 알고 있다고 가정할 때 사용할 수 있지만 이 방법으로 상품 이미지 
    테이블에서는 더 이상 상품 기본 이미지를 갖지 않게 됨으로 inner join으로 상품 이미지 테이블과 관계를 맺으면 쿼리 결과가 null로 나오게 된다. 이점 때문에 left join을 사용하여 상품 이미지가 없더라고 쿼리를 실행 시킬 수 있게 된다. 이 부분에 있어 상품을 가져올 때는 DB 성능이 낮아 질 수 있다.
## TO DO

1. 나중에 집가서 환경 정보 파일(.env.dev) 데이터를 내 메일로 보내기 // 완료
2. 데이터를 변경하는 모든 서비스로직에 트랜잭션 적용하기 // 완료
3. 미디어관련 엔티티가 데이터베이스에서 삭제 되면 서버 폴더내에 미디어 파일 물리적으로 삭제하기 // 완료
4. 2, 3을 모두 수행하게 될 때 장바구니, 결제 구현하기 // 장바구니 완료
5. 결제 로직 만들기 // 완료
6. repository.vo, query-runner.provider에 공통으로 들어있는 메서드로 인터페이스 만들기 // 완료
7. query-runner.provider -> query-runner.initializer로 이름 바꾸기 // 완료
8. .transaction 로직 파일에 있는 try catch finally문을 프로미스에서 처리하게 바꿔보기 // 완료
9. 상품 검색을할 때 전체 상품을 다 가져오는것이 아닌 몇개씩 끊어서 페이징 처리 해보기 // 보류
10. 상품을 카테고리 별로 가져오는 api 추가하기 // 보류
11. 상품, 사용자 프로필을 가져올 때 redis적용해보기 // 보류
12. 9 ~ 11까지 모두 수행하면 aws 배포 해보기 // 보류
13. API 정상화 (버그 수정) // 완료
14. user, product 등 많이 사용되는 entity Join을 Generic하게 변경 // 진행중
15. repository에서 entity와 raw를 분리 // 진행중
16. SWAGGER API DOCUMENTATION 설정
17. JOI 사용해서 DotenvModule 설정
18. 회원가입시 이메일 인증 로직 추가
19. 14 ~ 18까지 모두 수행하면 플러터로 앱 개발 후 API 연동 진행 (쿠기를 사용하는 로직을 header를 사용하도록 변경 필요)
20. 쿼리 성능 최적화
21. 20까지 완료 후 9 ~ 11 진행
