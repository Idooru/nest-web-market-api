import { Transactional } from "src/common/interfaces/initializer/transactional";
import { AccountRepositoryPayload } from "./account-repository.payload";
import { DataSource, QueryRunner } from "typeorm";
import { Implemented } from "src/common/decorators/implemented.decoration";
import { AccountEntity } from "../../entities/account.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AccountTransactionInitializer extends Transactional<AccountRepositoryPayload> {
  private payload: AccountRepositoryPayload;

  constructor(private readonly dataSource: DataSource) {
    super();
  }

  @Implemented
  public async init(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    this.payload = {
      account: queryRunner.manager.getRepository(AccountEntity),
    };

    return queryRunner;
  }

  @Implemented
  public getRepository(): AccountRepositoryPayload {
    return this.payload;
  }
}
