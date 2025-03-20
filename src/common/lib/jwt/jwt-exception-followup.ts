import { Implemented } from "../../decorators/implemented.decoration";

export interface JwtExceptionMessageGenerator {
  generate(): string;
}

export class InvalidAccessToken implements JwtExceptionMessageGenerator {
  @Implemented
  public generate(): string {
    return "변조된 access-token 입니다.";
  }
}

export class InvalidRefreshToken implements JwtExceptionMessageGenerator {
  @Implemented
  public generate(): string {
    return "변조된 refresh-token 입니다.";
  }
}

export class ExpiredAccessToken implements JwtExceptionMessageGenerator {
  @Implemented
  public generate(): string {
    return "access-token이 만료되었습니다. 토큰을 재발급 받으세요.";
  }
}

export class ExpiredRefreshToken implements JwtExceptionMessageGenerator {
  @Implemented
  public generate(): string {
    return "refresh-token이 만료되었습니다. 로그아웃 됩니다.";
  }
}

export class InvalidJwtPayload implements JwtExceptionMessageGenerator {
  @Implemented
  public generate(): string {
    return "변조된 jwt payload 입니다.";
  }
}
