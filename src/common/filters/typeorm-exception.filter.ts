import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { TypeOrmException } from "../errors/typeorm.exception";
import { Response } from "express";
import { TypeOrmExceptionType } from "./interface/typeorm-exception.interface";

@Catch(TypeOrmException)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: TypeOrmException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const err = exception.getResponse() as TypeOrmExceptionType;

    return res.status(err.statusCode).json({
      success: false,
      message: "TypeOrm Exception이 발생하였습니다.",
      timestamp: new Date().toString(),
      error: "TypeOrm Exception",
      reason: err.error.message,
      info: "Typeorm Config, Entity, SQL 서버의 상태를 확인하세요.",
    });
  }
}
