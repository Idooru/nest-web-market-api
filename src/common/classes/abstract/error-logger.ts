import { loggerFactory } from "src/common/functions/logger.factory";

export abstract class ErrorLogger {
  constructor(
    protected readonly error: Error,
    protected readonly className: string,
    protected readonly methodName: string,
  ) {}

  protected logging(): void {
    loggerFactory(this.className).error(
      `Error occurred in ${this.className} class`,
    );
    loggerFactory(this.methodName).error(this.error);
  }
}
