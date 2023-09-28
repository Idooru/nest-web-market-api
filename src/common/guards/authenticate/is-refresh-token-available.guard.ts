import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtRefreshTokenPayload } from "src/model/auth/jwt/jwt-refresh-token-payload.interface";
import { SecurityLibrary } from "../../lib/config/security.library";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { JwtErrorHandlingBuilder } from "src/common/lib/error-handler/jwt-error-handling.builder";
import { HttpExceptionHandlingBuilder } from "src/common/lib/error-handler/http-exception-handling.builder";

@Injectable()
export class IsRefreshTokenAvailableGuard
  extends ErrorHandlerProps
  implements CanActivate
{
  constructor(
    private readonly securityLibrary: SecurityLibrary,
    private readonly jwtService: JwtService,
    private readonly httpExceptionHandlingBuilder: HttpExceptionHandlingBuilder,
    private readonly jwtErrorHandlerBuilder: JwtErrorHandlingBuilder,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const { refresh_token } = req.signedCookies;

    if (!refresh_token) {
      this.methodName = this.canActivate.name;
      this.httpExceptionHandlingBuilder
        .setMessage(
          "refresh_token이 없으므로 access_token을 재발급 받기 위한 작업을 할 수 없습니다.",
        )
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.UNAUTHORIZED)
        .handle();
    }

    req.user = await this.validateToken(refresh_token);

    return true;
  }

  async validateToken(refresh_token: string): Promise<JwtRefreshTokenPayload> {
    try {
      return await this.jwtService.verifyAsync(
        refresh_token,
        this.securityLibrary.jwtRefreshTokenVerifyOption,
      );
    } catch (err) {
      this.methodName = this.validateToken.name;
      this.jwtErrorHandlerBuilder
        .setError(err)
        .setWhatToken("refresh_token")
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }
}
