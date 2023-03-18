import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class VerifyDataGuard implements CanActivate {
  private readonly data: string[];

  constructor(...data: string[]) {
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
        throw new UnauthorizedException(
          "검증에 필요한 쿠키가 일치하지 않았기 때문에 해당 로직을 사용할 수 없습니다. 검증 API를 먼저 실행시켜 주세요.",
        );
      }

      importedCookies.forEach((cookie) => res.clearCookie(cookie));

      return true;
    }
    return true;
  }
}