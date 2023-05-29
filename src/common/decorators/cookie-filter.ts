import { HttpStatus } from "@nestjs/common";
import { Request } from "express";
import { HttpExceptionHandlingBuilder } from "../lib/error-handler/http-exception-handling.builder";

export const cookieFilter = (req: Request, data: string): void => {
  if (!req.signedCookies[data]) {
    new HttpExceptionHandlingBuilder()
      .setMessage(`데이터(${data})에 해당하는 쿠키를 가져올 수 없습니다.`)
      .setOccuredLocation("function")
      .setOccuredFunction(cookieFilter.name)
      .setExceptionStatus(HttpStatus.BAD_REQUEST)
      .handle();
  }
};
