import { TypeORMError } from "typeorm";
import { TypeOrmErrorHandlingLibrary } from "./typeorm-error-handling.library";
import { ErrorHandlerStrategy } from "./interface/error-handler-strategy.interface";

export class TypeOrmErrorHandlingBuilder {
  private handler: new (
    error: TypeORMError,
    stuffs: string[],
    stuffMeans: string[],
  ) => ErrorHandlerStrategy;
  private error: TypeORMError;
  private className: string;
  private methodName: string;
  public static stuffs: string[] = [];
  public static stuffMeans: string[] = [];

  public setErrorHandler(
    handler: new (
      error: TypeORMError,
      stuffs: string[],
      stuffMeans: string[],
    ) => ErrorHandlerStrategy,
  ) {
    this.handler = handler;
    return this;
  }

  public setError(error: TypeORMError): this {
    this.error = error;
    return this;
  }

  public setSourceNames(className: string, methodName: string): this {
    this.className = className;
    this.methodName = methodName;
    return this;
  }

  public setStuffs(stuff: string, stuffMean: string): this {
    TypeOrmErrorHandlingBuilder.stuffs.push(stuff);
    TypeOrmErrorHandlingBuilder.stuffMeans.push(stuffMean);
    return this;
  }

  public handle() {
    return new TypeOrmErrorHandlingLibrary(
      this.error,
      this.className,
      this.methodName,
      this.handler,
      TypeOrmErrorHandlingBuilder.stuffs,
      TypeOrmErrorHandlingBuilder.stuffMeans,
    );
  }
}
