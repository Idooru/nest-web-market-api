import { CanActivate, ExecutionContext, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { HttpExceptionHandlingBuilder } from "src/common/lib/error-handler/http-exception-handling.builder";

export class VerifyDataGuard extends ErrorHandlerProps implements CanActivate {
  private readonly data: string[];

  constructor(...data: string[]) {
    super();
    this.data = data;
  }

  canActivate(context: ExecutionContext): boolean {
    if (process.env.NODE_ENV !== "dev") {
      const req = context.switchToHttp().getRequest<Request>();
      const res = context.switchToHttp().getResponse<Response>();

      const needCookies = this.data;
      const importedCookies = Object.keys(req.signedCookies).filter((cookie) =>
        needCookies.includes(cookie),
      );

      const sortedNeedCookies = needCookies.sort();
      const sortedImportedCookies = importedCookies.sort();

      const isEqual =
        needCookies.length === importedCookies.length &&
        sortedNeedCookies.every(
          (cookieKey, idx) => cookieKey === sortedImportedCookies[idx],
        );

      if (!isEqual) {
        this.methodName = this.canActivate.name;
        new HttpExceptionHandlingBuilder()
          .setMessage(
            "검증에 필요한 쿠키가 일치하지 않았기 때문에 해당 로직을 사용할 수 없습니다. 검증 API를 먼저 실행시켜 주세요.",
          )
          .setOccuredLocation("class")
          .setOccuredClass(this.className, this.methodName)
          .setExceptionStatus(HttpStatus.UNAUTHORIZED)
          .handle();
      }

      importedCookies.forEach((cookie) => res.clearCookie(cookie));

      return true;
    }
    return true;
  }
}
