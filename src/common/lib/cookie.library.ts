import { Injectable } from "@nestjs/common";

@Injectable()
export class CookieLibrary {
  public insertNumberOnContinuousCookies<T>(
    stuff: T[],
    cookieKey: string,
  ): ({
    whatCookie: string;
  } & T)[] {
    return stuff.map((cookieValue, idx) => ({
      whatCookie: cookieKey + (idx + 1),
      ...cookieValue,
    }));
  }
}
