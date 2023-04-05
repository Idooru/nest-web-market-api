import {
  ArgumentsHost,
  CallHandler,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { TimeLoggerLibrary } from "../../lib/logger/time-logger.library";
import { SecurityLibrary } from "../../lib/config/security.library";
import { JsonJwtAuthInterface } from "./interface/json-jwt-auth.interface";
import { Request, Response } from "express";

@Injectable()
export class JsonJwtAuthInterceptor implements NestInterceptor {
  constructor(
    private readonly timeLoggerLibrary: TimeLoggerLibrary,
    private readonly securityLibrary: SecurityLibrary,
  ) {}

  intercept(context: ArgumentsHost, next: CallHandler<any>): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const cookieOption = this.securityLibrary.getCookieOption();

    this.timeLoggerLibrary.receiveRequest(req);

    return next.handle().pipe(
      map((data: JsonJwtAuthInterface) => {
        const { statusCode, message, cookieKey, cookieValue } = data;
        this.timeLoggerLibrary.sendResponse(req);

        for (let i = 0; i < 2; i++) {
          res.cookie(cookieKey[i], cookieValue[i], cookieOption);
        }

        res.status(data.statusCode).setHeader("X-Powered-By", "");
        return { success: true, ...{ statusCode, message } };
      }),
    );
  }
}
