import { TypeORMError } from "typeorm";
import { TypeOrmException } from "../../errors/typeorm.exception";
import { loggerFactory } from "../../functions/logger.factory";
import { LibraryError } from "../../errors/library.error";
import { LibraryException } from "../../errors/library.exception";

export class TransactionErrorHandler {
  handle(err: LibraryError & TypeORMError): never {
    if (err.response.type.includes("library")) {
      throw new LibraryException(err);
    } else {
      loggerFactory("TypeOrmError").error(err);
      throw new TypeOrmException(err);
    }
  }
}
