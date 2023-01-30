import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtRefreshTokenPayload } from "src/model/auth/jwt/jwt-refresh-token-payload.interface";
import { SecurityLibrary } from "../lib/security.library";

@Injectable()
export class IsRefreshTokenAvailableGuard implements CanActivate {
  constructor(
    private readonly securityLibrary: SecurityLibrary,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const { refresh_token } = req.signedCookies;

    if (!refresh_token) {
      throw new UnauthorizedException(
        "refresh_token이 없으므로 access_token을 재발급 받기 위한 작업을 할 수 없습니다.",
      );
    }

    req.user = await this.validateToken(refresh_token);

    return true;
  }

  async validateToken(refresh_token: string): Promise<JwtRefreshTokenPayload> {
    try {
      return await this.jwtService.verifyAsync(
        refresh_token,
        this.securityLibrary.getJwtRefreshTokenVerifyOption(),
      );
    } catch (err) {
      if (err.name.includes("Expired")) {
        throw new UnauthorizedException(
          "만료된 refresh_token입니다. 다시 로그인 해주세요.",
        );
      }
      throw new UnauthorizedException("유효하지 않은 토큰입니다.");
    }
  }
}
