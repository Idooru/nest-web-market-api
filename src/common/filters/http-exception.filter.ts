import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { HttpExceptionType } from "./interface/http-exception.interface";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const err = exception.getResponse() as HttpExceptionType;

    return res.status(err.statusCode).setHeader("X-Powered-By", "").json({
      success: false,
      statusCode: err.statusCode,
      message: "Http Exception이 발생하였습니다.",
      timestamp: new Date().toString(),
      error: err.error,
      reason: err.message,
      info: "서버 로그를 확인하세요.",
    });
  }
}
