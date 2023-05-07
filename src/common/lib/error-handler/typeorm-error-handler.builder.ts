import { EntityTarget, TypeORMError } from "typeorm";
import { TypeOrmErrorHandler } from "./typeorm-error-handler.library";

export class TypeOrmErrorHandlerBuilder {
  private entity: EntityTarget;
  private error: TypeORMError;
  private className: string;
  private methodName: string;
  public static stuffs: string[] = [];
  public static stuffMeans: string[] = [];

  public setEntity(entity: EntityTarget): this {
    this.entity = entity;
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
      this.entity,
      TypeOrmErrorHandlerBuilder.stuffs,
      TypeOrmErrorHandlerBuilder.stuffMeans,
    );
  }
}
