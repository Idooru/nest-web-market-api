import { ErrorLogger } from "src/common/classes/abstract/error-logger";
import { Throwable } from "./interface/throwable.interface";
import { JsonWebTokenError } from "jsonwebtoken";
import { JwtServiceException } from "src/common/errors/jwt-service.exception";
import { JwtWhatToken } from "src/model/auth/jwt/jwt-what-token.type";

export class JwtErrorHandler extends ErrorLogger implements Throwable {
  constructor(
    protected readonly error: JsonWebTokenError,
    protected readonly className: string,
    protected readonly methodName: string,
    protected readonly whatToken: JwtWhatToken,
    protected readonly token: string,
  ) {
    super(error, className, methodName);
    this.main();
  }

  private main() {
    super.logging();
  }

  throwException(): never {
    throw new JwtServiceException(this.error, this.whatToken, this.token);
  }
}
