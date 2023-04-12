import { ErrorHandler } from "./error-handler.library";

export class ErrorHandlerBuilder<T> {
  private entity: T;
  private error: Error;
  private className: string;
  private methodName: string;
  public static stuffs: string[] = [];
  public static stuffMeans: string[] = [];
  private layer: string;

  public setEntity(entity: T): this {
    this.entity = entity;
    return this;
  }

  public setError(error: Error): this {
    this.error = error;
    return this;
  }

  public setSourceNames(className: string, methodName: string): this {
    this.className = className;
    this.methodName = methodName;
    return this;
  }

  public setStuffs(stuff: string, stuffMean: string): this {
    ErrorHandlerBuilder.stuffs.push(stuff);
    ErrorHandlerBuilder.stuffMeans.push(stuffMean);
    return this;
  }

  public setLayer(layer: string): this {
    this.layer = layer;
    return this;
  }

  public handle() {
    return new ErrorHandler(
      this.entity,
      this.error,
      this.className,
      this.methodName,
      ErrorHandlerBuilder.stuffs,
      ErrorHandlerBuilder.stuffMeans,
      this.layer,
    );
  }
}
