import {
  ArgumentsHost,
  CallHandler,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { TimeLoggerLibrary } from "../../lib/time-logger.library";
import { Request, Response } from "express";
import { JsonClearCookieInterface } from "./interface/json-clear-cookie.interface";

@Injectable()
export class JsonClearCookieInterceptor implements NestInterceptor {
  constructor(private readonly timeLoggerLibrary: TimeLoggerLibrary) {}

  intercept(context: ArgumentsHost, next: CallHandler<any>): Observable<any> {
    // controller 도달 전
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    this.timeLoggerLibrary.receiveRequest(req);

    return next.handle().pipe(
      map((data: JsonClearCookieInterface) => {
        const { statusCode, message, cookieKey } = data;
        // controller 도달 후
        this.timeLoggerLibrary.sendResponse(req);

        res
          .status(statusCode)
          .setHeader("X-Powered-By", "")
          .clearCookie(cookieKey);

        return { success: true, ...{ statusCode, message } };
      }),
    );
  }
}
