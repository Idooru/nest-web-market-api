import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { TypeOrmException } from "../errors/typeorm.exception";
import { Response } from "express";

@Catch(TypeOrmException)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: TypeOrmException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const { error } = exception.getResponse() as TypeOrmException;

    return res.status(exception.getStatus()).json({
      success: false,
      error: error.name,
      statusCode: exception.getStatus(),
      timestamp: new Date().toString(),
      message: error.message,
      info: "Typeorm Config, Entity, 요청 쿼리, SQL 서버의 상태를 확인하세요.",
    });
  }
}
