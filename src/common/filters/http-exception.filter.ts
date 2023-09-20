import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";

type ExceptionPayload = { status: string; reason: { message: string } };

type ExceptionResponse = {
  statusCode: number;
  message: string | Array<ExceptionPayload>;
};

type JsonResponse = {
  success: boolean;
  error: string;
  statusCode: number;
  timestamp: Date;
  reason?: string | string[];
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private jsonResponse: JsonResponse;

  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const exceptionResponse = exception.getResponse() as ExceptionResponse;

    this.jsonResponse = {
      success: false,
      error: exception.name,
      statusCode: exception.getStatus(),
      timestamp: new Date(),
    };

    if (Array.isArray(exceptionResponse.message)) {
      this.jsonResponse.reason = exceptionResponse.message.map(
        (err) => err.reason.message,
      );
    } else {
      this.jsonResponse.reason = exception.message;
    }

    return res
      .status(exception.getStatus())
      .setHeader("X-Powered-By", "")
      .json(this.jsonResponse);
  }
}
