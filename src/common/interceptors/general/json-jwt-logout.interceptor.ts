import {
  ArgumentsHost,
  CallHandler,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { TimeLoggerLibrary } from "../../lib/time-logger.library";
import { map, Observable } from "rxjs";
import { Request, Response } from "express";

@Injectable()
export class JsonJwtLogoutInterceptor implements NestInterceptor {
  constructor(private readonly timeLoggerLibrary: TimeLoggerLibrary) {}

  intercept(context: ArgumentsHost, next: CallHandler<any>): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    this.timeLoggerLibrary.receiveRequest(req);

    return next.handle().pipe(
      map((data) => {
        const { cookieKey, statusCode, message } = data;

        this.timeLoggerLibrary.sendResponse(req);
        cookieKey.forEach((token: string) => res.clearCookie(token));

        res.status(statusCode).setHeader("X-Powered-By", "");

        return { success: true, ...{ statusCode, message } };
      }),
    );
  }
}