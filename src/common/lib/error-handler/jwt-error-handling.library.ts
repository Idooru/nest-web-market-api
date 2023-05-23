import { ErrorLogger } from "src/common/classes/abstract/error-logger";
import { JsonWebTokenError } from "jsonwebtoken";
import { JwtWhatToken } from "src/model/auth/jwt/jwt-what-token.type";
import { Injectable } from "@nestjs/common";
import { JwtServiceException } from "src/common/errors/jwt-service.exception";

@Injectable()
export class JwtErrorHandlingLibrary extends ErrorLogger {
  constructor(
    protected readonly error: JsonWebTokenError,
    protected readonly className: string,
    protected readonly methodName: string,
    private readonly whatToken: JwtWhatToken,
  ) {
    super(error, className, methodName);
    this.main();
  }

  private info: string;

  private main(): void {
    super.logging();

    if (this.whatToken) {
      // whatToken 프로퍼티를 확인하는 경우는 토큰을 검증 할 경우이다.
      this.whatToken === "access_token"
        ? this.setInfoAccessToken()
        : this.setInfoRefreshToken();
    } else {
      // 토큰을 생성하는 경우이다.
      this.info = "토큰을 생성할 때 사용한 옵션 값을 확인하세요.";
    }

    this.throwJwtServiceException();
  }

  private setInfoAccessToken(): void {
    if (this.error.name.includes("Expired")) {
      this.info =
        "만료된 access_token입니다. refresh_token을 이용하여 토큰을 재발급 받거나 다시 로그인 해주세요.";
    } else {
      this.setInfoInvalidToken();
    }
  }

  private setInfoRefreshToken(): void {
    if (this.error.name.includes("Expired")) {
      this.info = "만료된 refresh_token입니다. 다시 로그인 해주세요.";
    } else {
      this.setInfoInvalidToken();
    }
  }

  private setInfoInvalidToken(): void {
    this.info = "유효하지 않은 토큰입니다.";
  }

  private throwJwtServiceException(): never {
    throw new JwtServiceException(this.info, this.error);
  }
}
