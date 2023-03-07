import { BadRequestException } from "@nestjs/common";
import { Request } from "express";

export const filtering = (req: Request, data: string): void => {
  if (req.signedCookies.length >= 2) {
    const filtering = Object.keys(req.signedCookies).filter((cookie) =>
      cookie.includes(data),
    );

    if (!filtering.length) {
      throw new BadRequestException(
        `데이터(${data})에 해당하는 쿠키를 가져올 수 없습니다.`,
      );
    }
  } else {
    if (!req.signedCookies[data]) {
      throw new BadRequestException(
        `데이터(${data})에 해당하는 쿠키를 가져올 수 없습니다.`,
      );
    }
  }
};
