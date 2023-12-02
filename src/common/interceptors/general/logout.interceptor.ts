import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { Request, Response } from "express";
import { LogoutInterface } from "../interface/logout.interface";
import { TimeLoggerLibrary } from "../../lib/logger/time-logger.library";

@Injectable()
export class LogoutInterceptor implements NestInterceptor {
  constructor(private readonly timeLoggerLibrary: TimeLoggerLibrary) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    this.timeLoggerLibrary.receiveRequest(req);

    return next.handle().pipe(
      map((data: LogoutInterface) => {
        const { cookieKey, statusCode, message } = data;

        this.timeLoggerLibrary.sendResponse(req);
        cookieKey.forEach((token: string) => res.clearCookie(token));

        res.status(statusCode).setHeader("X-Powered-By", "");

        return { success: true, ...{ statusCode, message } };
      }),
    );
  }
}
