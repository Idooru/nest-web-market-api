import {
  ArgumentsHost,
  CallHandler,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { TimeLoggerLibrary } from "../../lib/time-logger.library";
import { JsonGeneralParamInterface } from "./interface/json-general-param.interface";
import { Request, Response } from "express";

@Injectable()
export class JsonGeneralInterceptor implements NestInterceptor {
  constructor(private readonly timeLoggerLibrary: TimeLoggerLibrary) {}

  intercept(context: ArgumentsHost, next: CallHandler<any>): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    this.timeLoggerLibrary.receiveRequest(req);

    return next.handle().pipe(
      map((data: JsonGeneralParamInterface) => {
        this.timeLoggerLibrary.sendResponse(req);

        res.status(data.statusCode).setHeader("X-Powered-By", "");

        return { success: true, ...data };
      }),
    );
  }
}
