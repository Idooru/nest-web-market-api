import { EntityTarget } from "typeorm";
import { ErrorHandler } from "./error-handler.library";

export class ErrorHandlerBuilder<T> {
  private entity: EntityTarget<T>;
  private error: Error;
  private className: string;
  private methodName: string;
  private stuff: string;
  private stuffMean: string;
  private layer: string;

  public setEntity(entity: EntityTarget<T>): this {
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

  public setStuffs(stuff?: string, stuffMean?: string): this {
    this.stuff = stuff;
    this.stuffMean = stuffMean;
    return this;
  }

  public setLayer(layer: string): this {
    this.layer = layer;
    return this;
  }

  public invoke() {
    return new ErrorHandler(
      this.entity,
      this.error,
      this.className,
      this.methodName,
      this.stuff,
      this.stuffMean,
      this.layer,
    );
  }
}
