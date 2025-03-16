import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { loggerFactory } from "../../functions/logger.factory";
import { Implemented } from "../../decorators/implemented.decoration";

@Injectable()
export class IsNotLoginGuard implements CanActivate {
  @Implemented
  public canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const accessToken = req.signedCookies["access-token"];

    if (accessToken) {
      const message = "현재 로그인 중이므로 해당 작업을 수행할 수 없습니다.";
      loggerFactory("AlreadyLogin").error(message);
      throw new BadRequestException(message);
    }

    return true;
  }
}
