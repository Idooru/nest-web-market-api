import {
  CallHandler,
  ArgumentsHost,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";
import { TimeLoggerLibrary } from "../lib/time-logger.library";

@Injectable()
export class JsonClearCookieInterceptor implements NestInterceptor {
  constructor(private readonly timeLoggerLibrary: TimeLoggerLibrary) {}
  intercept(context: ArgumentsHost, next: CallHandler<any>): Observable<any> {
    // controller 도달 전
    const res = context.switchToHttp().getResponse();
    const req = context.switchToHttp().getResponse();

    this.timeLoggerLibrary.receiveRequest(req);

    return next.handle().pipe(
      map((data) => {
        const { cookieKey, statusCode, message, result } = data;
        // controller 도달 후
        this.timeLoggerLibrary.sendResponse(req);

        res
          .status(data.statusCode)
          .setHeader("X-Powered-By", "")
          .clearCookie(cookieKey);

        return { success: true, ...{ statusCode, message, result } };
      }),
    );
  }
}
