import {
  CallHandler,
  ArgumentsHost,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";

@Injectable()
export class JsonClearCookieInterceptor implements NestInterceptor {
  intercept(context: ArgumentsHost, next: CallHandler<any>): Observable<any> {
    // controller 도달 전
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    console.log(`Receive request from ${req.method} ${req.originalUrl}`);
    const now = Date.now();

    return next.handle().pipe(
      map((data) => {
        const { cookieKey, statusCode, message, result } = data;
        // controller 도달 후
        console.log(
          `Send response from ${req.method} ${
            req.originalUrl
          } :: time taken : ${Date.now() - now}ms`,
        );

        if (typeof cookieKey === "string") {
          res.clearCookie(cookieKey);
        } else {
          if (cookieKey.length >= 2) {
            cookieKey.forEach((idx: string) => res.clearCookie(idx));
          } else {
            res.clearCookie(cookieKey[0]);
          }
        }

        res.status(data.statusCode).setHeader("X-Powered-By", "");

        return { success: true, ...{ statusCode, message, result } };
      }),
    );
  }
}
