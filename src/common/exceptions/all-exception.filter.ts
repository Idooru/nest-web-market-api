import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { HttpError } from "../interfaces/http-error.interface";
import { ValidationError } from "../interfaces/validation-error.interface";
import { Response } from "express";

@Catch(HttpException)
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    const err = exception.getResponse() as HttpError | ValidationError;

    if (typeof err !== "string" && err.error === "Bad Request") {
      return res.status(err.statusCode).setHeader("X-Powered-By", "").json({
        success: false,
        statusCode: err.statusCode,
        messsage: "Validation Exception이 발생하였습니다.",
        timestamp: new Date().toString(),
        reason: err.message,
      });
    }

    if (err.message.length >= 2 && err.error === "Register Error") {
      return res
        .status(err.statusCode)
        .setHeader("X-Powered-By", "")
        .json({
          success: false,
          message: `${err.error}가 발생하였습니다.`,
          timestamp: new Date().toString(),
          reason: err.message.map((idx) => idx.response),
        });
    }

    res.status(err.statusCode).setHeader("X-Powered-By", "").json({
      success: false,
      statusCode: err.statusCode,
      message: "Http Exception이 발생하였습니다.",
      timestamp: new Date().toString(),
      reason: err.message,
      error: err.error,
    });
  }
}
