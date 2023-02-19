import {
  ArgumentsHost,
  CallHandler,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { TimeLoggerLibrary } from "../../lib/time-logger.library";
import { SecurityLibrary } from "../../lib/security.library";
import { JsonSendCookiesParam } from "./interface/json-send-cookies-param.interface";

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
      map((data: JsonSendCookiesParam) => {
        // controller 도달 후
        const { statusCode, message, cookieKey, cookieValues } = data;
        this.timeLoggerLibrary.sendResponse(req);

        if (cookieValues.length >= 2) {
          cookieValues.forEach((cookieValue, idx) => {
            res.cookie(cookieKey + (idx + 1), cookieValue, cookieOption);
          });
        } else {
          res.cookie(cookieKey, cookieValues[0], cookieOption);
        }

        res.status(data.statusCode).setHeader("X-Powered-By", "");
        return { success: true, ...{ statusCode, message } };
      }),
    );
  }
}
