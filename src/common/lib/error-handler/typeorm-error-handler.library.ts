import { TypeOrmException } from "src/common/errors/typeorm.exception";
import { TypeORMError } from "typeorm";
import { TypeOrmErrorHandlerBuilder } from "./typeorm-error-handler.builder";
import { ErrorLogger } from "src/common/classes/abstract/error-logger";
import { Throwable } from "./interface/throwable.interface";
import { ErrorHandlerStrategy } from "./interface/error-handler-strategy.interface";

export class TypeOrmErrorHandler extends ErrorLogger implements Throwable {
  constructor(
    protected readonly error: TypeORMError,
    protected readonly className: string,
    protected readonly methodName: string,
    private readonly Handler: new (
      error: TypeORMError,
      stuffs: string[],
      stuffMeans: string[],
    ) => ErrorHandlerStrategy,
    private readonly stuffs: string[],
    private readonly stuffMeans: string[],
  ) {
    super(error, className, methodName);

    this.main();
  }

  private main() {
    super.logging();
    this.clearStuffs();
    this.handleEntityError();
  }

  private clearStuffs() {
    TypeOrmErrorHandlerBuilder.stuffs = [];
    TypeOrmErrorHandlerBuilder.stuffMeans = [];
  }

  private handleEntityError(): void {
    new this.Handler(this.error, this.stuffs, this.stuffMeans);
  }

  public throwException(): never {
    throw new TypeOrmException(this.error);
  }
}
