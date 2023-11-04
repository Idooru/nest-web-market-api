import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { Request } from "express";
import { SecurityLibrary } from "../../lib/security/security.library";
import { CatchCallbackFactoryLibrary } from "../../lib/util/catch-callback-factory.library";
import { loggerFactory } from "../../functions/logger.factory";

@Injectable()
export class IsLoginGuard implements CanActivate {
  constructor(
    private readonly securityLibrary: SecurityLibrary,
    private readonly jwtService: JwtService,
    private readonly callbackFactory: CatchCallbackFactoryLibrary,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const { access_token }: { access_token: string } = req.signedCookies;

    if (!access_token) {
      const message =
        "access_token이 없으므로 인증이 필요한 작업을 수행할 수 없습니다.";
      loggerFactory("NoneAccessToken").error(message);
      throw new UnauthorizedException(message);
    }

    req.user = await this.validateToken(access_token);

    return true;
  }

  async validateToken(access_token: string): Promise<JwtAccessTokenPayload> {
    return await this.jwtService
      .verifyAsync(
        access_token,
        this.securityLibrary.jwtAccessTokenVerifyOption,
      )
      .catch(this.callbackFactory.getCatchJwtTokenVerifyFunc());
  }
}
