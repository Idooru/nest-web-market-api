import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtRefreshTokenPayload } from "src/model/auth/jwt/jwt-refresh-token-payload.interface";
import { SecurityLibrary } from "../../lib/config/security.library";
import { loggerFactory } from "../../functions/logger.factory";
import { CatchCallbackFactoryLibrary } from "../../lib/util/catch-callback-factory.library";

@Injectable()
export class IsRefreshTokenAvailableGuard implements CanActivate {
  constructor(
    private readonly securityLibrary: SecurityLibrary,
    private readonly jwtService: JwtService,
    private readonly callbackFactory: CatchCallbackFactoryLibrary,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const { refresh_token } = req.signedCookies;

    if (!refresh_token) {
      const message =
        "refresh_token이 없으므로 access_token을 재발급 받기 위한 작업을 할 수 없습니다.";
      loggerFactory("NoneRefreshToken").error(message);
      throw new UnauthorizedException(message);
    }

    req.user = await this.validateToken(refresh_token);

    return true;
  }

  async validateToken(refresh_token: string): Promise<JwtRefreshTokenPayload> {
    return await this.jwtService
      .verifyAsync(
        refresh_token,
        this.securityLibrary.jwtRefreshTokenVerifyOption,
      )
      .catch(this.callbackFactory.getCatchJwtTokenVerifyFunc());
  }
}
