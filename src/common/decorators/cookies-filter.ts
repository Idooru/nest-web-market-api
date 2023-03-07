import { BadRequestException } from "@nestjs/common";
import { Request } from "express";

export const cookiesFilter = (req: Request, data: string): void => {
  const filtering = Object.keys(req.signedCookies).filter((cookie) =>
    cookie.includes(data),
  );

  if (!filtering.length) {
    throw new BadRequestException(
      `데이터(${data})에 해당하는 쿠키를 가져올 수 없습니다.`,
    );
  }
};
