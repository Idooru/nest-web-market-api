import { HttpException, HttpStatus } from "@nestjs/common";
import { Throwable } from "./interface/throwable.interface";
import { loggerFactory } from "src/common/functions/logger.factory";

export class HttpExceptionHandlingLibrary implements Throwable {
  constructor(
    private readonly message: string,
    private readonly className: string,
    private readonly methodName: string,
    private readonly functionName: string,
    private readonly exceptionStatus: HttpStatus,
  ) {}

  public main() {
    this.logging();
    this.throwException();
  }

  private logging() {
    if (this.className) {
      loggerFactory(this.className).error(
        `Error occurred in ${this.className} class`,
      );
      loggerFactory(this.methodName).error(this.message);
    } else {
      loggerFactory(this.functionName).error(this.message);
    }
  }

  throwException(): never {
    throw new HttpException(
      { message: this.message, statusCode: this.exceptionStatus },
      this.exceptionStatus,
    );
  }
}
