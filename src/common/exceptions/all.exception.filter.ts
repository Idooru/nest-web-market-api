import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { HttpError } from "../interfaces/http.error.interface";
import { ValidationError } from "../interfaces/validation.error.interface";
import { Response } from "express";

@Catch(HttpException)
export class AllExceptionFilter implements ExceptionFilter {
  // findPromiseErrorInsidePromise(
  //   errMessage: string[] | PromiseRejectedResult[],
  // ): boolean {
  //   const result = errMessage.

  //   return true;
  // }

  // 프로미스 처리 중 프로미스 처리에 발생한 에러
  // if (err.error.includes("Errors")) {
  //   return res
  //     .status(err.statusCode)
  //     .setHeader("X-Powered-By", "")
  //     .json({
  //       success: false,
  //       message: `${err.error}가 발생하였습니다.`,
  //       timestamp: new Date().toString(),
  //       reason: err.message.map((idx: any) => idx.reason.response),
  //     });
  // }

  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const err = exception.getResponse() as HttpError | ValidationError;

    // Validation Excepntion 처리
    if (err.error === "Unsupported Media Type") {
      return res.status(err.statusCode).setHeader("X-Powered-By", "").json({
        success: false,
        statusCode: err.statusCode,
        messsage: "Validation Exception이 발생하였습니다.",
        timestamp: new Date().toString(),
        reason: err.message,
      });
    }

    // 프로미스 처리 중 발생한 에러
    if (err.error.includes("Errors")) {
      return res
        .status(err.statusCode)
        .setHeader("X-Powered-By", "")
        .json({
          success: false,
          message: `${err.error}가 발생하였습니다.`,
          timestamp: new Date().toString(),
          reason: err.message.map((idx: any) => idx.reason.response),
        });
    }

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
