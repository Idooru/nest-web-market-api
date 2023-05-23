import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { JwtServiceException } from "../errors/jwt-service.exception";
import { Response } from "express";
import { JwtServiceExceptionType } from "./interface/jwt-service-exception.interface";

@Catch(JwtServiceException)
export class JwtServiceExceptionFilter implements ExceptionFilter {
  catch(exception: JwtServiceException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const err = exception.getResponse() as JwtServiceExceptionType;

    if (err.info.includes("만료된 refresh_token")) {
      const cookieKey = ["access_token", "refresh_token"];
      cookieKey.forEach((token) => res.clearCookie(token));
    }

    return res.status(403).json({
      success: false,
      message: "Jwt Service Exception이 발생하였습니다.",
      timestamp: new Date().toString(),
      error: err.error.name,
      reason: err.error.message,
      info: err.info,
    });
  }
}
