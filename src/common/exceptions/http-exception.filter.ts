import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { HttpError } from "../interfaces/http-error.interface";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    const status = exception.getStatus();
    const error = exception.getResponse() as HttpError;

    console.error(error);

    res
      .status(status)
      .setHeader("X-Powered-By", "")
      .json({
        error: {
          success: false,
          statusCode: status,
          timestamp: new Date().toString(),
          ...error,
        },
      });
  }
}
