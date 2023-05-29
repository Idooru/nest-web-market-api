import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Request } from "express";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { HttpExceptionHandlingBuilder } from "src/common/lib/error-handler/http-exception-handling.builder";

@Injectable()
export class IsNotLoginGuard extends ErrorHandlerProps implements CanActivate {
  constructor(
    private readonly httpExceptionHandlingBuilder: HttpExceptionHandlingBuilder,
  ) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (req.signedCookies.access_token || req.signedCookies.refresh_token) {
      this.methodName = this.canActivate.name;
      this.httpExceptionHandlingBuilder
        .setMessage("현재 로그인 중이므로 해당 작업을 수행할 수 없습니다.")
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.BAD_REQUEST)
        .handle();
    }
    return true;
  }
}
