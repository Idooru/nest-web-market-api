import {
  CallHandler,
  ArgumentsHost,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";
import { EtcConfig } from "../config/etc.config";
import { TimeLoggerLibrary } from "../lib/time.logger.library";

@Injectable()
export class JsonSendCookieInterceptor implements NestInterceptor {
  constructor(
    private readonly etcConfig: EtcConfig,
    private readonly timeLoggerLibrary: TimeLoggerLibrary,
  ) {}

  intercept(context: ArgumentsHost, next: CallHandler<any>): Observable<any> {
    // controller 도달 전
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    this.timeLoggerLibrary.receiveRequest(req);

    return next.handle().pipe(
      map((data) => {
        // controller 도달 후
        const { cookieKey, cookieValue, statusCode, message, result } = data;
        this.timeLoggerLibrary.sendResponse(req);

        res
          .status(data.statusCode)
          .setHeader("X-Powered-By", "")
          .cookie(cookieKey, cookieValue, this.etcConfig.cookieOption);

        return { success: true, ...{ statusCode, message, result } };
      }),
    );
  }
}
