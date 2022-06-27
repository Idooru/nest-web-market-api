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

    switch (err.error) {
      // Validation Exception 혹은 업로드 할 때 파일 확장자가 올바르지 않을 때 발생
      case "Unsupported Media Type":
        return res.status(err.statusCode).setHeader("X-Powered-By", "").json({
          success: false,
          statusCode: err.statusCode,
          messsage: "Validation Exception이 발생하였습니다.",
          timestamp: new Date().toString(),
          reason: err.message,
        });
      // 회원가입 혹은 이메일 찾기 할 때 요청값이 올바르지 않을 때 발생 주로 에러 메세지가 2-3개 씩 올 수 있음
      case "Check User Column For Find Email Error":
      case "Save User Column For Register Error":
      case "Find User Object For Register Error":
      case "Check User Column For Register Error":
      case "Save Object For Patch User Info Error":
      case "Check User Column For Patch User Info Error":
      case "Delete Object For Secession User Error":
        return res
          .status(err.statusCode)
          .setHeader("X-Powered-By", "")
          .json({
            success: false,
            message: `${err.error}가 발생하였습니다.`,
            timestamp: new Date().toString(),
            reason: err.message.map((idx: any) => idx.reason.response),
          });
      // 그 외 상황
      default:
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
}
