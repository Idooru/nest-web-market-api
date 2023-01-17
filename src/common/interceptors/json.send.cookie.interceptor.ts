import {
  CallHandler,
  ArgumentsHost,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";
import { EtcConfig } from "../config/etc.config";

@Injectable()
export class JsonSendCookieInterceptor implements NestInterceptor {
  constructor(private readonly etcConfig: EtcConfig) {}

  intercept(context: ArgumentsHost, next: CallHandler<any>): Observable<any> {
    // controller 도달 전
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    console.log(`Receive request from ${req.method} ${req.originalUrl}`);
    const now = Date.now();

    return next.handle().pipe(
      map((data) => {
        // controller 도달 후
        const { cookieKey, cookieValue, statusCode, message, result } = data;
        console.log(
          `Send response from ${req.method} ${
            req.originalUrl
          } :: time taken : ${Date.now() - now}ms`,
        );

        res
          .status(data.statusCode)
          .setHeader("X-Powered-By", "")
          .cookie(cookieKey, cookieValue, this.etcConfig.cookieOption);

        return { success: true, ...{ statusCode, message, result } };
      }),
    );
  }
}
