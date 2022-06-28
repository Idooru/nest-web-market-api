import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
} from "@nestjs/common";
import { Request } from "express";

export class IsNotLoginGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (req.signedCookies.JWT_COOKIE) {
      throw new BadRequestException(
        "현재 로그인 중이므로 해당 작업을 수행할 수 없습니다.",
      );
    }
    return true;
  }
}
