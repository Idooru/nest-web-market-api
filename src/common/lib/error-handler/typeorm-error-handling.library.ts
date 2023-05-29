import { TypeORMError } from "typeorm";
import { TypeOrmErrorHandlingBuilder } from "./typeorm-error-handling.builder";
import { ErrorLogger } from "src/common/classes/abstract/error-logger";
import { ErrorHandlerStrategy } from "./interface/error-handler-strategy.interface";

export class TypeOrmErrorHandlingLibrary extends ErrorLogger {
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

  public main(): void {
    super.logging();
    this.clearStuffs();
    this.handleEntityError();
  }

  private clearStuffs(): void {
    TypeOrmErrorHandlingBuilder.stuffs = [];
    TypeOrmErrorHandlingBuilder.stuffMeans = [];
  }

  private handleEntityError(): void {
    new this.Handler(this.error, this.stuffs, this.stuffMeans);
  }
}
