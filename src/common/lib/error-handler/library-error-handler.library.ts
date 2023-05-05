import { Logger } from "@nestjs/common";
import { LibraryException } from "src/common/errors/library.exception";

export class LibraryErrorHandler {
  constructor(
    private readonly error: Error,
    private readonly libraryName: string,
    private readonly className: string,
    private readonly methodName: string,
  ) {
    this.main();
  }

  private main() {
    this.logging();
    this.throwServiceException();
  }

  private logging(): void {
    const className = new Logger(this.className);
    const methodName = new Logger(this.methodName);

    className.error(`Error occurred in ${this.className} class`);
    methodName.error(this.error);
  }

  private throwServiceException(): never {
    throw new LibraryException(this.error, this.libraryName);
  }
}
