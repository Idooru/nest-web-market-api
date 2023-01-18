import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { HttpError } from "./interface/http.error.interface";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const err = exception.getResponse() as HttpError;

    return res.status(err.statusCode).setHeader("X-Powered-By", "").json({
      success: false,
      statusCode: err.statusCode,
      message: "Http Exception이 발생하였습니다.",
      timestamp: new Date().toString(),
      reason: err.message,
      error: err.error,
    });
  }
}
