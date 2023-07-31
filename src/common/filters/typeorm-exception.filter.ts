import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { TypeOrmException } from "../errors/typeorm.exception";
import { Response } from "express";

@Catch(TypeOrmException)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: TypeOrmException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    return res.status(exception.getStatus()).json({
      success: false,
      error: exception.name,
      statusCode: exception.getStatus(),
      timestamp: new Date().toString(),
      reason: exception.message,
      info: "Typeorm Config, Entity, 요청 쿼리, SQL 서버의 상태를 확인하세요.",
    });
  }
}
