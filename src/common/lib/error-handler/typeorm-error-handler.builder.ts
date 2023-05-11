import { TypeORMError } from "typeorm";
import { TypeOrmErrorHandler } from "./typeorm-error-handler.library";
import { ErrorHandlerStrategy } from "./interface/error-handler-strategy.interface";

export class TypeOrmErrorHandlerBuilder {
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
    TypeOrmErrorHandlerBuilder.stuffs.push(stuff);
    TypeOrmErrorHandlerBuilder.stuffMeans.push(stuffMean);
    return this;
  }

  public handle() {
    return new TypeOrmErrorHandler(
      this.error,
      this.className,
      this.methodName,
      this.handler,
      TypeOrmErrorHandlerBuilder.stuffs,
      TypeOrmErrorHandlerBuilder.stuffMeans,
    );
  }
}
