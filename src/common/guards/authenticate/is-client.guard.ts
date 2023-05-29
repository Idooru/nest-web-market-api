import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Request } from "express";
import { HttpExceptionHandlingBuilder } from "src/common/lib/error-handler/http-exception-handling.builder";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
@Injectable()
export class IsClientGuard extends ErrorHandlerProps implements CanActivate {
  constructor(
    private readonly httpExceptionHandlingBuilder: HttpExceptionHandlingBuilder,
  ) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest() as Request;
    const { user } = req;

    if (user.userRole !== "client") {
      this.methodName = this.canActivate.name;
      this.httpExceptionHandlingBuilder
        .setMessage("client 계정만 수행 할 수 있는 작업입니다.")
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.UNAUTHORIZED)
        .handle();
    }

    return true;
  }
}
