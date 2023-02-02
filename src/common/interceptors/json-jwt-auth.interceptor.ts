import {
  CallHandler,
  ArgumentsHost,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";
import { TimeLoggerLibrary } from "../lib/time-logger.library";
import { SecurityLibrary } from "../lib/security.library";

@Injectable()
export class JsonJwtAuthInterceptor implements NestInterceptor {
  constructor(
    private readonly timeLoggerLibrary: TimeLoggerLibrary,
    private readonly securityLibrary: SecurityLibrary,
  ) {}

  intercept(context: ArgumentsHost, next: CallHandler<any>): Observable<any> {
    // controller 도달 전
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const cookieOption = this.securityLibrary.getCookieOption();

    this.timeLoggerLibrary.receiveRequest(req);

    return next.handle().pipe(
      map((data) => {
        // controller 도달 후
        const { cookieKey, cookieValue, statusCode, message, result } = data;
        this.timeLoggerLibrary.sendResponse(req);

        for (let i = 0; i < 2; i++) {
          res.cookie(cookieKey[i], cookieValue[i], cookieOption);
        }

        res.status(data.statusCode).setHeader("X-Powered-By", "");
        return { success: true, ...{ statusCode, message, result } };
      }),
    );
  }
}
