import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { LibraryException } from "../errors/library.exception";
import { Response } from "express";
import { Implemented } from "../decorators/implemented.decoration";

@Catch(LibraryException)
export class LibraryExceptionFilter implements ExceptionFilter {
  @Implemented
  public catch(exception: LibraryException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const { error } = exception.getResponse() as LibraryException;

    return res.status(exception.getStatus()).json({
      success: false,
      error: error.response.errorCase,
      statusCode: exception.getStatus(),
      timeStamp: new Date().toString(),
      libraryName: error.response.libraryName,
      message: error.response.message,
      info: "해당 라이브러리의 구성 설정, 인자값 등을 확인하세요.",
    });
  }
}
