import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { Response } from "express";
import { ValidationException } from "../errors/validation.exception";
import { ValidationExceptionType } from "./interface/validation-exception.interface";

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const err = exception.getResponse() as ValidationExceptionType;

    return res.status(err.statusCode).json({
      success: false,
      message: "Validation Exception이 발생하였습니다.",
      timestamp: new Date().toString(),
      error: "Validation Exception",
      reason: err.errors,
      info: "전송될 데이터의 유효성을 잘 확인해주세요.",
    });
  }
}
