import { QueryRunner, TypeORMError } from "typeorm";
import { LibraryError } from "../../errors/library.error";
import { LibraryException } from "../../errors/library.exception";
import { loggerFactory } from "../../functions/logger.factory";
import { TypeOrmException } from "../../errors/typeorm.exception";

export class TransactionHandler {
  private queryRunner: QueryRunner;

  public setQueryRunner(queryRunner: QueryRunner): void {
    this.queryRunner = queryRunner;
  }

  public async commit(): Promise<void> {
    await this.queryRunner.commitTransaction();
  }

  public async rollback(err: LibraryError & TypeORMError): Promise<void> {
    await this.queryRunner.rollbackTransaction();
    if (err.response.type.includes("library")) {
      throw new LibraryException(err);
    } else {
      loggerFactory("TypeOrmError").error(err);
      throw new TypeOrmException(err);
    }
  }

  public async release(): Promise<void> {
    await this.queryRunner.release();
  }
}
