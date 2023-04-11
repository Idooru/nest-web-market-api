import {
  ArgumentsHost,
  CallHandler,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";
import { TimeLoggerLibrary } from "../../lib/logger/time-logger.library";
import { Request, Response } from "express";
import { SecurityLibrary } from "src/common/lib/config/security.library";
import { VerifyDataInterface } from "./verify-data.dto";

@Injectable()
export class SendVerifyCookieInterceptor implements NestInterceptor {
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
      map((data: VerifyDataInterface) => {
        const { setCookieKey } = data;

        this.timeLoggerLibrary.sendResponse(req);

        res
          .status(200)
          .setHeader("X-Powered-By", "")
          .cookie(setCookieKey, true, cookieOption);

        return { success: true, ...data };
      }),
    );
  }
}
