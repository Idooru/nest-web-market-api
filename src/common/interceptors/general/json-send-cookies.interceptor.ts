import { ArgumentsHost, CallHandler, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { TimeLoggerLibrary } from "../../lib/logger/time-logger.library";
import { SecurityLibrary } from "../../lib/security/security.library";
import { Request, Response } from "express";
import { JsonSendCookiesInterface } from "../interface/json-send-cookies.interface";
import { Implemented } from "../../decorators/implemented.decoration";

@Injectable()
export class JsonSendCookiesInterceptor<T> implements NestInterceptor {
  constructor(
    private readonly timeLoggerLibrary: TimeLoggerLibrary,
    private readonly securityLibrary: SecurityLibrary,
  ) {}

  @Implemented
  public intercept(context: ArgumentsHost, next: CallHandler<any>): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const cookieOption = this.securityLibrary.cookieOption;

    this.timeLoggerLibrary.receiveRequest(req);

    return next.handle().pipe(
      map((data: JsonSendCookiesInterface<T>) => {
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
