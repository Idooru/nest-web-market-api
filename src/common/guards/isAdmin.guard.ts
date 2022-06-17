import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

export class IsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const { user } = req;

    if (user.userType !== "admin") {
      throw new UnauthorizedException(
        "admin 계정만 수행 할 수 있는 작업입니다.",
      );
    }

    return true;
  }
}
