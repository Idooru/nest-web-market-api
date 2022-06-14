import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtModuleOptions } from "@nestjs/jwt";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./../interfaces/jwt-payload.interface";
import { UserRepository } from "./../../model/user/user.repository";
import { Request } from "express";

@Injectable()
export class IsLoginGuard implements CanActivate {
  constructor(private readonly userRepository: UserRepository) {}

  private JwtOptions: JwtModuleOptions = {
    secret: process.env.JWT_SECRET,
  };

  private jwtService = new JwtService(this.JwtOptions);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const { JWT_COOKIE } = req.cookies;

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
