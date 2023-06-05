import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { LibraryException } from "../errors/library.exception";
import { Response } from "express";

@Catch(LibraryException)
export class LibraryExceptionFilter implements ExceptionFilter {
  catch(exception: LibraryException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const result = exception.getResponse() as { libraryName: string };

    return res.status(exception.getStatus()).json({
      success: false,
      error: result.libraryName,
      statusCode: exception.getStatus(),
      timestamp: new Date().toString(),
      reason: exception.message,
      info: "해당 라이브러리의 구성 설정, 인자값 등을 확인하세요.",
    });
  }
}
