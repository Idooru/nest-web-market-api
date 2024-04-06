import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { loggerFactory } from "../../functions/logger.factory";
import { Implemented } from "../../decorators/implemented.decoration";

@Injectable()
export class IsClientGuard implements CanActivate {
  @Implemented
  public canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest() as Request;
    const { user } = req;

    if (user.userRole !== "client") {
      const message = "client 계정만 수행 할 수 있는 작업입니다.";
      loggerFactory("OnlyClient").error(message);
      throw new UnauthorizedException(message);
    }

    return true;
  }
}
