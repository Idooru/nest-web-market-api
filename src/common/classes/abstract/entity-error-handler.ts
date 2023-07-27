import { ErrorHandlerStrategy } from "src/common/lib/error-handler/interface/error-handler-strategy.interface";
import { TypeORMError } from "typeorm";
import { ErrorCaseProp } from "./error-case-prop";
import { TypeOrmException } from "src/common/errors/typeorm.exception";

export abstract class EntityErrorHandler
  extends ErrorCaseProp
  implements ErrorHandlerStrategy
{
  constructor(protected stuffs: string[], protected stuffMeans: string[]) {
    super(stuffs, stuffMeans);
  }

  abstract handle(error: TypeORMError): void;

  public throwException(error: Error): never {
    throw new TypeOrmException(error);
  }
}
