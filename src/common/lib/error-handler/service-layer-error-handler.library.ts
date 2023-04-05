import { InternalServerErrorException, Logger } from "@nestjs/common";

export class ServiceLayerErrorHandlerLibrary {
  private className: string;
  private methodName: string;
  private error: Error;

  public init(className: string, methodName: string, error: Error) {
    this.className = className;
    this.methodName = methodName;
    this.error = error;

    this.logging();
    this.throwInternalServerErrorException();
  }

  private logging(): void {
    const className = new Logger(this.className);
    const methodName = new Logger(this.methodName);

    className.error(`Error occured in ${this.className} class`);
    methodName.error(this.error);
  }

  private throwInternalServerErrorException(): never {
    throw new InternalServerErrorException(this.error.message);
  }
}
