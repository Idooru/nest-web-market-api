import { createParamDecorator, ArgumentsHost } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common/exceptions";
import { Request } from "express";

export const Cookies = createParamDecorator(
  (data: string, context: ArgumentsHost): any => {
    const req = context.switchToHttp().getRequest() as Request;

    const filtering = Object.keys(req.signedCookies).filter((cookie) =>
      cookie.includes(data),
    );

    if (!filtering.length) {
      throw new BadRequestException(
        `데이터(${data})에 해당하는 쿠키를 가져올 수 없습니다.`,
      );
    }

    return Object.entries(req.signedCookies)
      .filter((cookie) => cookie[0].includes(data))
      .map((cookie) => cookie[1]);
  },
);
