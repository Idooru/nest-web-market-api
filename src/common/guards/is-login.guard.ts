import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../interfaces/jwt.payload.interface";
import { Request, Response } from "express";
import { EtcConfig } from "../config/etc.config";

@Injectable()
export class IsLoginGuard implements CanActivate {
  constructor(private readonly etcConfig: EtcConfig) {}

  private readonly jwtOptions = this.etcConfig.jwtOptions;
  private readonly jwtService = new JwtService(this.jwtOptions);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const { JWT_COOKIE } = req.signedCookies;

    if (!JWT_COOKIE) {
      throw new UnauthorizedException(
        "토큰이 없으므로 인증이 필요한 작업을 수행할 수 없습니다.",
      );
    }

    req.user = await this.validateToken(JWT_COOKIE, res);

    return true;
  }

  async validateToken(token: string, res: Response): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token, this.jwtOptions);
    } catch (err) {
      if (err.name.includes("Expired")) {
        res.clearCookie("JWT_COOKIE");

        throw new UnauthorizedException(
          "만료된 토큰입니다. 다시 로그인 해주세요.",
        );
      }
      throw new UnauthorizedException("유효하지 않은 토큰입니다.");
    }
  }
}
