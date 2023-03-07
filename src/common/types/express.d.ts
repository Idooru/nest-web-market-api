// pacakge.json의 모든 의존성들을 최신 버전으로 업데이트 하다보니 IsLoginGuard 혹은 IsRefreshTokenAvailableGuard에서 req.user를 사용하는 부분에서 에러가 나게 되었다.
//"'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>' 형식에 'user' 속성이 없습니다."
// 그래서 아래 처럼 속성을 따로 추가해주었더니 정상 작동하게 되었다.
// 이 부분은 타입스크립트 namespace에 대해 더 자세히 알아보겠다.

declare namespace Express {
  interface Request {
    user: any;
  }
}
