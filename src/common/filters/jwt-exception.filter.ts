import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { JwtException } from "../errors/jwt.exception";
import { Request, Response } from "express";
import { JwtError } from "../errors/jwt.error";
import { loggerFactory } from "../functions/logger.factory";
import { Implemented } from "../decorators/implemented.decoration";

@Catch(JwtException)
export class JwtExceptionFilter implements ExceptionFilter {
  @Implemented
  public catch(exception: JwtException, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest<Request>();
    const res = host.switchToHttp().getResponse<Response>();
    const { error } = exception.getResponse() as JwtException;

    const message = this.generateResponseMessage(error, res);
    loggerFactory(error.name).error(message);

    return res.status(exception.getStatus()).json({
      success: false,
      error: error.name,
      statusCode: error.status,
      timeStamp: new Date().toString(),
      message,
    });
  }

  public generateResponseMessage(error: JwtError, res: Response): string {
    if (error.message === "invalid signature" && error.whatToken === "access_token") {
      return "변조된 access_token입니다.";
    } else if (error.message === "invalid_signature" && error.whatToken === "refresh_token") {
      return "변조된 refresh_token입니다.";
    } else if (error.message === "jwt expired" && error.whatToken === "access_token") {
      return "access_token의 만료기간이 다되었습니다. 토큰을 재발급 받아주세요.";
    } else if (error.message === "jwt expired" && error.whatToken === "refresh_token") {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return "refresh_token의 만료기간이 다되었습니다. 로그아웃 됩니다.";
    } else {
      return "잘못된 jwt 생성 옵션입니다.";
    }
  }
}
