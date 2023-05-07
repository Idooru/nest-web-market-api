import { Logger } from "@nestjs/common";

export abstract class ErrorLogger {
  constructor(
    protected readonly error: Error,
    protected readonly className: string,
    protected readonly methodName: string,
  ) {}

  protected logging(): void {
    const className = new Logger(this.className);
    const methodName = new Logger(this.methodName);

    className.error(`Error occurred in ${this.className} class`);
    methodName.error(this.error);
  }
}
