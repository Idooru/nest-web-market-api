import {
  ArgumentsHost,
  CallHandler,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { TimeLoggerLibrary } from "../../lib/time-logger.library";
import { SecurityLibrary } from "../../lib/security.library";
import { JsonSendCookieParam } from "./interface/json-send-cookie-param.interface";

@Injectable()
export class JsonSendCookieInterceptor implements NestInterceptor {
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
      map((data: JsonSendCookieParam) => {
        // controller 도달 후
        const { statusCode, message, cookieKey, cookieValue } = data;
        this.timeLoggerLibrary.sendResponse(req);

        res
          .status(data.statusCode)
          .setHeader("X-Powered-By", "")
          .cookie(cookieKey, cookieValue, cookieOption);

        return { success: true, ...{ statusCode, message } };
      }),
    );
  }
}
