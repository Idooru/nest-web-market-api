import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    return res
      .status(exception.getStatus())
      .setHeader("X-Powered-By", "")
      .json({
        success: false,
        error: exception.name,
        statusCode: exception.getStatus(),
        timestamp: new Date().toString(),
        reason: exception.message,
        info: "서버 로그를 확인하세요.",
      });
  }
}
