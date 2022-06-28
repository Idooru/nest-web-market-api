import { ArgumentsHost } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";

export const IsAdmin = createParamDecorator(
  (data: any, context: ArgumentsHost) => {
    const req = context.switchToHttp().getRequest();
    const { user } = req;

    if (user.userType !== "admin") {
      throw new UnauthorizedException(
        "admin 계정만 수행 할 수 있는 작업입니다.",
      );
    }
  },
);
