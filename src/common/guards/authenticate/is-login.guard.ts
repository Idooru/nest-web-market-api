import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { Request } from "express";
import { SecurityLibrary } from "../../lib/security.library";

@Injectable()
export class IsLoginGuard implements CanActivate {
  constructor(
    private readonly securityLibrary: SecurityLibrary,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const { access_token } = req.signedCookies;

    if (!access_token) {
      throw new UnauthorizedException(
        "access_token이 없으므로 인증이 필요한 작업을 수행할 수 없습니다.",
      );
    }

    req.user = await this.validateToken(access_token);

    return true;
  }

  async validateToken(access_token: string): Promise<JwtAccessTokenPayload> {
    try {
      return await this.jwtService.verifyAsync(
        access_token,
        this.securityLibrary.getJwtAcessTokenVerifyOption(),
      );
    } catch (err) {
      if (err.name.includes("Expired")) {
        throw new UnauthorizedException(
          "만료된 access_token입니다. refresh_token을 이용하여 토큰을 재발급 받거나 다시 로그인 해주세요.",
        );
      }
      throw new UnauthorizedException("유효하지 않은 토큰입니다.");
    }
  }
}