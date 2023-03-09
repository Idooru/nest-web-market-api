import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";

export class IsClientGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest() as Request;
    const { user } = req;

    if (user.userType !== "client") {
      throw new UnauthorizedException(
        "client 계정만 수행 할 수 있는 작업입니다.",
      );
    }

    return true;
  }
}
