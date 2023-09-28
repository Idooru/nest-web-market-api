import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { Request } from "express";
import { SecurityLibrary } from "../../lib/config/security.library";
import { JwtErrorHandlingBuilder } from "src/common/lib/error-handler/jwt-error-handling.builder";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { HttpExceptionHandlingBuilder } from "src/common/lib/error-handler/http-exception-handling.builder";

@Injectable()
export class IsLoginGuard extends ErrorHandlerProps implements CanActivate {
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
    const { access_token }: { access_token: string } = req.signedCookies;

    if (!access_token) {
      this.methodName = this.canActivate.name;
      this.httpExceptionHandlingBuilder
        .setMessage(
          "access_token이 없으므로 인증이 필요한 작업을 수행할 수 없습니다.",
        )
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.UNAUTHORIZED)
        .handle();
    }

    req.user = await this.validateToken(access_token);

    return true;
  }

  async validateToken(access_token: string): Promise<JwtAccessTokenPayload> {
    try {
      return await this.jwtService.verifyAsync(
        access_token,
        this.securityLibrary.jwtAccessTokenVerifyOption,
      );
    } catch (err) {
      this.methodName = this.validateToken.name;
      this.jwtErrorHandlerBuilder
        .setError(err)
        .setWhatToken("access_token")
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }
}
