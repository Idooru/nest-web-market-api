import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { TimeLoggerLibrary } from "../../lib/logger/time-logger.library";
import { SecurityLibrary } from "../../lib/security/security.library";
import { Implemented } from "../../decorators/implemented.decoration";
import { map, Observable } from "rxjs";
import { Request, Response } from "express";
import { RefreshTokenInterface } from "../interface/refresh-token.interface";

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
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
      map((data: RefreshTokenInterface) => {
        const { statusCode, message, accessToken } = data;
        this.timeLoggerLibrary.sendResponse(req);

        res.cookie("access-token", accessToken, cookieOption);

        res.status(data.statusCode).setHeader("X-Powered-By", "");
        return { success: true, ...{ statusCode, message } };
      }),
    );
  }
}
