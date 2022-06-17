import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./../interfaces/jwt-payload.interface";
import { Request } from "express";
import { JwtOptions } from "../config/etc";

@Injectable()
export class IsLoginGuard implements CanActivate {
  private readonly jwtOptions = JwtOptions;
  private readonly jwtService = new JwtService(this.jwtOptions);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const { JWT_COOKIE } = req.signedCookies;

    if (!JWT_COOKIE) {
      throw new UnauthorizedException(
        "토큰이 없으므로 인중이 필요한 작업을 수행할 수 없습니다.",
      );
    }

    req.user = await this.validateToken(JWT_COOKIE);

    return true;
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.decode(token) as JwtPayload;
    } catch (err) {
      throw new UnauthorizedException("유효하지 않은 토큰입니다.");
    }
  }
}
