import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { JwtException } from "../errors/jwt.exception";
import { Response } from "express";
import { JwtError } from "../errors/jwt.error";
import { loggerFactory } from "../functions/logger.factory";
import { Implemented } from "../decorators/implemented.decoration";
import {
  InvalidAccessToken,
  InvalidRefreshToken,
  ExpiredAccessToken,
  ExpiredRefreshToken,
  InvalidJwtPayload,
  JwtExceptionMessageGenerator,
} from "../lib/jwt/jwt-exception-followup";

@Catch(JwtException)
export class JwtExceptionFilter implements ExceptionFilter {
  jwtExceptionMap: Record<string, new () => JwtExceptionMessageGenerator> = {
    "invalid token:access_token": InvalidAccessToken,
    "invalid token:refresh_token": InvalidRefreshToken,
    "invalid signature:access_token": InvalidAccessToken,
    "invalid signature:refresh_token": InvalidRefreshToken,
    "jwt expired:access_token": ExpiredAccessToken,
    "jwt expired:refresh_token": ExpiredRefreshToken,
  };

  @Implemented
  public catch(exception: JwtException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const { error } = exception.getResponse() as JwtException;

    const generator = this.jwtExceptionMessageGeneratorFactory(error);
    const message = this.generateResponseMessage(generator);
    loggerFactory(error.name).error(message);

    return res.status(exception.getStatus()).json({
      success: false,
      error: error.name,
      statusCode: error.status,
      timeStamp: new Date().toString(),
      message,
    });
  }

  public jwtExceptionMessageGeneratorFactory(error: JwtError) {
    const key = `${error.message}:${error.whatToken}`;
    const ExceptionClass = this.jwtExceptionMap[key] || InvalidJwtPayload;
    return new ExceptionClass();
  }

  public generateResponseMessage(generator: JwtExceptionMessageGenerator): string {
    return generator.generate();
  }
}
