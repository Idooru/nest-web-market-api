import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnsupportedMediaTypeException,
  ImATeapotException,
} from "@nestjs/common";
import { Response } from "express";
import { ValidationError } from "./interface/validation.error.interface";

/**
 * Promise Exception Filter 처럼 내가 원하는 타이밍에
 * PromiseHandleExceiption을 던져서 던져진 예외를 캐치하고 싶었지만
 * Validation Exception Filter는 main.ts에서 validation pipe에
 * 특정 http status code를 적용시키고 적용된 status code와 일치하는 예외를
 * 던져야만 예외를 캐치할 수 있어서 PromiseHandleException 처럼 커스텀으로
 * 만들어서 사용할 수 없었다. 만약 아무 HttpException을 캐치하게 되면
 * HttpExceptionFilter에서 거쳐야 할 예외가 ValidationExceoptionFilter로
 * 들어올 수 있게 되며 서로 다른 ExceptionFilter간에 독창성이 떨어지게 된다.
 * 결국 별로 사용되지 않을거 같은 ImATeapotException을 임시로 사용하겠다.
 * 나중에 커스텀 예외를 만들어서 캐치할 수 있게 된다면 ImATeapotException
 * 을 대신하여 커스텀 예외를 만들어 붙일 계획이다. 임시로 일단 사용한다.
 */
@Catch(ImATeapotException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: UnsupportedMediaTypeException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const err = exception.getResponse() as ValidationError;

    return res.status(400).json({
      success: false,
      message: "Validation Exception이 발생하였습니다.",
      timestamp: new Date().toString(),
      reason: err.message.map((idx) => idx),
      error: "Validation Error",
    });
  }
}
