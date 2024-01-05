import { QueryRunner, TypeORMError } from "typeorm";
import { Injectable } from "@nestjs/common";
import { TransactionErrorHandler } from "../error-handler/transaction-error.handler";
import { LibraryError } from "../../errors/library.error";
import { LibraryException } from "../../errors/library.exception";
import { loggerFactory } from "../../functions/logger.factory";
import { TypeOrmException } from "../../errors/typeorm.exception";

@Injectable()
export class TransactionHandler {
  constructor(
    private readonly transactionErrorHandler: TransactionErrorHandler,
  ) {}

  public async commit(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.commitTransaction();
  }

  public async rollback(
    queryRunner: QueryRunner,
    err: LibraryError & TypeORMError,
  ): Promise<void> {
    await queryRunner.rollbackTransaction();
    if (err.response.type.includes("library")) {
      throw new LibraryException(err);
    } else {
      loggerFactory("TypeOrmError").error(err);
      throw new TypeOrmException(err);
    }
  }

  public async release(queryRunner: QueryRunner) {
    await queryRunner.release();
  }
}
