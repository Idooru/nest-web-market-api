import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { Request, Response } from "express";
import { LoginInterface } from "../interface/login.interface";
import { TimeLoggerLibrary } from "../../lib/logger/time-logger.library";
import { SecurityLibrary } from "../../lib/security/security.library";
import { Implemented } from "../../decorators/implemented.decoration";

@Injectable()
export class LoginInterceptor implements NestInterceptor {
  constructor(
    private readonly timeLoggerLibrary: TimeLoggerLibrary,
    private readonly securityLibrary: SecurityLibrary,
  ) {}

  @Implemented
  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const cookieOption = this.securityLibrary.cookieOption;

    this.timeLoggerLibrary.receiveRequest(req);

    return next.handle().pipe(
      map((data: LoginInterface) => {
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
