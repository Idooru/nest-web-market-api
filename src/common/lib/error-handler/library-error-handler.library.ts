import { ErrorLogger } from "src/common/classes/abstract/error-logger";
import { LibraryException } from "src/common/errors/library.exception";
import { Throwable } from "./interface/throwable.interface";

export class LibraryErrorHandler extends ErrorLogger implements Throwable {
  constructor(
    protected readonly error: Error,
    protected readonly className: string,
    protected readonly methodName: string,
    private readonly libraryName: string,
  ) {
    super(error, className, methodName);
    this.main();
  }

  private main() {
    super.logging();
    this.throwException();
  }

  public throwException(): never {
    throw new LibraryException(this.error, this.libraryName);
  }
}
