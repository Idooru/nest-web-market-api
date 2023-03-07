import { BadRequestException } from "@nestjs/common";
import { Request } from "express";

export const cookieFilter = (req: Request, data: string): void => {
  if (!req.signedCookies[data]) {
    throw new BadRequestException(
      `데이터(${data})에 해당하는 쿠키를 가져올 수 없습니다.`,
    );
  }
};
