import { ArgumentsHost, CallHandler, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { TimeLoggerLibrary } from "../../lib/logger/time-logger.library";
import { Request, Response } from "express";
import { JsonClearCookieInterface } from "../interface/json-clear-cookie.interface";
import { Implemented } from "../../decorators/implemented.decoration";

@Injectable()
export class JsonClearCookieInterceptor implements NestInterceptor {
  constructor(private readonly timeLoggerLibrary: TimeLoggerLibrary) {}

  @Implemented
  public intercept(context: ArgumentsHost, next: CallHandler<any>): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    this.timeLoggerLibrary.receiveRequest(req);

    return next.handle().pipe(
      map((data: JsonClearCookieInterface) => {
        const { statusCode, message, cookieKey } = data;
        this.timeLoggerLibrary.sendResponse(req);

        res.status(statusCode).setHeader("X-Powered-By", "").clearCookie(cookieKey);

        return { success: true, ...{ statusCode, message } };
      }),
    );
  }
}
