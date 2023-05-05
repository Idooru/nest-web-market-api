import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { LibraryException } from "../errors/library.exception";
import { Response } from "express";
import { LibraryExceptionType } from "./interface/library-exception.interface";

@Catch(LibraryException)
export class LibraryExceptionFilter implements ExceptionFilter {
  catch(exception: LibraryException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const err = exception.getResponse() as LibraryExceptionType;

    return res.status(err.statusCode).json({
      success: false,
      message: `${err.libraryName} Exception이 발생하였습니다.`,
      timestamp: new Date().toString(),
      error: err.libraryName,
      reason: err.error.message,
      info: "해당 라이브러리의 구성 설정, 인자값 등을 확인하세요.",
    });
  }
}
