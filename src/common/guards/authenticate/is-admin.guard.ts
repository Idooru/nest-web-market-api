import { CanActivate, ExecutionContext, HttpStatus } from "@nestjs/common";
import { Request } from "express";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { HttpExceptionHandlingBuilder } from "src/common/lib/error-handler/http-exception-handling.builder";

export class IsAdminGuard extends ErrorHandlerProps implements CanActivate {
  constructor(
    private readonly httpExceptionHandlingBuilder: HttpExceptionHandlingBuilder,
  ) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest() as Request;
    const { user } = req;

    if (user.userRole !== "admin") {
      this.methodName = this.canActivate.name;
      this.httpExceptionHandlingBuilder
        .setMessage("admin 계정만 수행 할 수 있는 작업입니다.")
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.UNAUTHORIZED)
        .handle();
    }

    return true;
  }
}
