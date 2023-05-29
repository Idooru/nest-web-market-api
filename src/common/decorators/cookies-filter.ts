import { Request } from "express";
import { HttpExceptionHandlingBuilder } from "../lib/error-handler/http-exception-handling.builder";
import { HttpStatus } from "@nestjs/common";

export const cookiesFilter = (req: Request, data: string): void => {
  const filtering = Object.keys(req.signedCookies).filter((cookie) =>
    cookie.includes(data),
  );

  if (!filtering.length) {
    new HttpExceptionHandlingBuilder()
      .setMessage(`데이터(${data})에 해당하는 쿠키를 가져올 수 없습니다.`)
      .setOccuredLocation("function")
      .setOccuredFunction(cookiesFilter.name)
      .setExceptionStatus(HttpStatus.BAD_REQUEST)
      .handle();
  }
};
