import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";

@Injectable()
export class JsonResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    // controller 도달 전
    const { method, originalUrl } = context.getArgByIndex(0);
    const res = context.switchToHttp().getResponse();

    console.log(`Request from ${method} ${originalUrl}`);
    const now = Date.now();

    return next.handle().pipe(
      map((data) => {
        // controller 도달 후
        console.log(
          `Response from ${method} ${originalUrl} :: time taken : ${
            Date.now() - now
          }ms`,
        );
        res
          .setHeader("X-Powered-By", "")
          .status(data.statusCode)
          .json({ success: true, ...data });
      }),
    );
  }
}
