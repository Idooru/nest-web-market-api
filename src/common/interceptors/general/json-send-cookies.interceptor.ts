import {
  ArgumentsHost,
  CallHandler,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { TimeLoggerLibrary } from "../../lib/time-logger.library";
import { SecurityLibrary } from "../../lib/security.library";

@Injectable()
export class JsonSendCookiesInterceptor implements NestInterceptor {
  constructor(
    private readonly timeLoggerLibrary: TimeLoggerLibrary,
    private readonly securityLibrary: SecurityLibrary,
  ) {}

  intercept(context: ArgumentsHost, next: CallHandler<any>): Observable<any> {
    // controller 도달 전
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const cookieOption = this.securityLibrary.getCookieOption();

    this.timeLoggerLibrary.receiveRequest(req);

    return next.handle().pipe(
      map((data) => {
        // controller 도달 후
        const { cookieKey, cookieValue, statusCode, message, result } = data;
        this.timeLoggerLibrary.sendResponse(req);

        if (cookieValue.length >= 2) {
          for (let i = 0; i < cookieValue.length; i++) {
            res.cookie(cookieKey + (i + 1), cookieValue[i], cookieOption);
          }
        } else {
          res.cookie(cookieKey, cookieValue[0], cookieOption);
        }
        res.status(data.statusCode).setHeader("X-Powered-By", "");
        return { success: true, ...{ statusCode, message, result } };
      }),
    );
  }
}
