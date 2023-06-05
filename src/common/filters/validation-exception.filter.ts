import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { Response } from "express";
import { ValidationException } from "../errors/validation.exception";

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const result = exception.getResponse() as { errors: string[] };

    return res.status(exception.getStatus()).json({
      success: false,
      error: exception.name,
      statusCode: exception.getStatus(),
      timestamp: new Date().toString(),
      reason: result.errors,
      info: "전송될 데이터의 유효성을 잘 확인해주세요.",
    });
  }
}
