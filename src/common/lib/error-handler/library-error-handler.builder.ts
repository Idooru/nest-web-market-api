import { LibraryErrorHandler } from "./library-error-handler.library";

export class LibraryErrorHandlerBuilder {
  private error: Error;
  private libraryName: string;
  private className: string;
  private methodName: string;

  public setError(error: Error): this {
    this.error = error;
    return this;
  }

  public setLibraryName(libraryName: string): this {
    this.libraryName = libraryName;
    return this;
  }

  public setSourceNames(className: string, methodName: string): this {
    this.className = className;
    this.methodName = methodName;
    return this;
  }

  public handle() {
    return new LibraryErrorHandler(
      this.error,
      this.libraryName,
      this.className,
      this.methodName,
    );
  }
}
