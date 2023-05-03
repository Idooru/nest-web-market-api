export class CookieLibrary {
  public insertNumberOnContinuousCookies<T>(
    stuff: T[],
    cookieKey: string,
  ): ({
    whatCookie: string;
  } & T)[] {
    if (stuff.length >= 2) {
      return stuff.map((cookieValue, idx) => ({
        whatCookie: cookieKey + (idx + 1),
        ...cookieValue,
      }));
    } else {
      return stuff.map((cookieValue) => ({
        whatCookie: cookieKey,
        ...cookieValue,
      }));
    }
  }

  public wrapCookieKeyInCookieValue<T>(
    stuff: T,
    cookieKey: string,
  ): {
    whatCookie: string;
  } & T {
    return { whatCookie: cookieKey, ...stuff };
  }
}
