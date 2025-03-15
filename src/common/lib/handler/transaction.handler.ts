import { QueryRunner, TypeORMError } from "typeorm";
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

  public async rollback(err: TypeORMError): Promise<void> {
    await this.queryRunner.rollbackTransaction();
    loggerFactory("TypeOrmError").error(err.stack);
    throw new TypeOrmException(err);
  }

  public async release(): Promise<void> {
    await this.queryRunner.release();
  }
}
