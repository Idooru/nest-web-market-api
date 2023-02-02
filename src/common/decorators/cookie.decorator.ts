import { createParamDecorator, ArgumentsHost } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common/exceptions";

export const Cookie = createParamDecorator(
  (data: string, context: ArgumentsHost): any => {
    const req = context.switchToHttp().getRequest();

    if (!req.signedCookies[data]) {
      throw new BadRequestException(
        `데이터(${data})에 해당하는 쿠키를 가져올 수 없습니다.`,
      );
    }
    return req.signedCookies[data];
  },
);
