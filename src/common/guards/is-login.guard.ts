import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { Request } from "express";
import { SecurityLibrary } from "../lib/security.library";

@Injectable()
export class IsLoginGuard implements CanActivate {
  constructor(private readonly securityLibrary: SecurityLibrary) {}

  private readonly jwtAccesTokenOption =
    this.securityLibrary.getJwtAceessTokenOption();
  private readonly jwtService = new JwtService(this.jwtAccesTokenOption);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const { JWT_COOKIE } = req.signedCookies;

    if (!JWT_COOKIE) {
      throw new UnauthorizedException(
        "토큰이 없으므로 인증이 필요한 작업을 수행할 수 없습니다.",
      );
    }

    req.user = await this.validateToken(JWT_COOKIE);

    return true;
  }

  async validateToken(token: string): Promise<JwtAccessTokenPayload> {
    try {
      return await this.jwtService.verifyAsync(token, this.jwtAccesTokenOption);
    } catch (err) {
      if (err.name.includes("Expired")) {
        throw new UnauthorizedException(
          "만료된 토큰입니다. 토큰을 재발급 받거나 다시 로그인 해주세요.",
        );
      }
      throw new UnauthorizedException("유효하지 않은 토큰입니다.");
    }
  }
}
