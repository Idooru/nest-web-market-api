import {
  ArgumentsHost,
  CallHandler,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { TimeLoggerLibrary } from "../../lib/logger/time-logger.library";
import { SecurityLibrary } from "../../lib/security/security.library";
import { JsonSendCookieParam } from "../interface/json-send-cookie-param.interface";
import { Request, Response } from "express";

@Injectable()
export class JsonSendCookieInterceptor implements NestInterceptor {
  constructor(
    private readonly timeLoggerLibrary: TimeLoggerLibrary,
    private readonly securityLibrary: SecurityLibrary,
  ) {}

  intercept(context: ArgumentsHost, next: CallHandler<any>): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const cookieOption = this.securityLibrary.cookieOption;

    this.timeLoggerLibrary.receiveRequest(req);

    return next.handle().pipe(
      map((data: JsonSendCookieParam) => {
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
