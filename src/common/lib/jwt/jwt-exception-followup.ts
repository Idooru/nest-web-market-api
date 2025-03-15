import { Implemented } from "../../decorators/implemented.decoration";

export interface JwtExceptionMessageGenerator {
  generate(): string;
}

export class InvalidAccessTokenSignature implements JwtExceptionMessageGenerator {
  @Implemented
  public generate(): string {
    return "변조된 access-token 입니다.";
  }
}

export class InvalidRefreshTokenSignature implements JwtExceptionMessageGenerator {
  @Implemented
  public generate(): string {
    return "변조된 refresh-token 입니다.";
  }
}

export class ExpiredAccessToken implements JwtExceptionMessageGenerator {
  @Implemented
  public generate(): string {
    return "access-token이 만료되었습니다. 토큰을 재발급 해주세요.";
  }
}

export class ExpiredRefreshToken implements JwtExceptionMessageGenerator {
  @Implemented
  public generate(): string {
    return "refresh-token이 만료되었습니다. 로그아웃 됩니다.";
  }
}

export class InvalidJwtCreationOption implements JwtExceptionMessageGenerator {
  @Implemented
  public generate(): string {
    return "잘못된 jwt 생성 옵션입니다.";
  }
}
