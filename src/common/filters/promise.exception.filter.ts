import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { PromiseHandleException } from "../exceptions/promise.handle.exception";
import { Response } from "express";

@Catch(PromiseHandleException)
export class PromiseExcptionFilter implements ExceptionFilter {
  catch(exception: PromiseHandleException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Promise Handle Exception이 발생하였습니다.",
      timestamp: new Date().toString(),
      reason: exception.errors.map((idx) => idx.reason.response),
    });
  }
}
