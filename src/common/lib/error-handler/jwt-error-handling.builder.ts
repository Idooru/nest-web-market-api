import { JsonWebTokenError } from "jsonwebtoken";
import { JwtErrorHandler } from "./jwt-error-handling.library";
import { JwtWhatToken } from "src/model/auth/jwt/jwt-what-token.type";

export class JwtErrorHandlingBuilder {
  private error: JsonWebTokenError;
  private whatToken: JwtWhatToken;
  private className: string;
  private methodName: string;

  public setError(error: JsonWebTokenError): this {
    this.error = error;
    return this;
  }

  public setWhatToken(whatToken: JwtWhatToken): this {
    this.whatToken = whatToken;
    return this;
  }

  public setSourceNames(className: string, methodName: string): this {
    this.className = className;
    this.methodName = methodName;
    return this;
  }

  public handle() {
    return new JwtErrorHandler(
      this.error,
      this.className,
      this.methodName,
      this.whatToken,
    );
  }
}
