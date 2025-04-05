import { Injectable } from "@nestjs/common";
import { AccountRepositoryPayload } from "./account-repository.payload";
import { Transactional } from "src/common/interfaces/initializer/transactional";
import { TransactionHandler } from "src/common/lib/handler/transaction.handler";
import { AccountTransactionContext } from "./account-transaction.context";
import { AccountTransactionSearcher } from "./account-transaction.searcher";
import { AccountBody } from "../../dtos/request/account-body.dto";

@Injectable()
export class AccountTransactionExecutor {
  constructor(
    private readonly transaction: Transactional<AccountRepositoryPayload>,
    private readonly handler: TransactionHandler,
    private readonly searcher: AccountTransactionSearcher,
    private readonly context: AccountTransactionContext,
  ) {}

  public async createAccount(body: AccountBody, userId: string): Promise<void> {
    const search = await this.searcher.searchCreateAccount(userId, body);
    const queryRunner = await this.transaction.init();
    this.handler.setQueryRunner(queryRunner);

    try {
      await this.context.createAccountContext(search);
      await this.handler.commit();
    } catch (err) {
      await this.handler.rollback(err);
    } finally {
      await this.handler.release();
    }
  }

  public async deleteAccount(accountId: string, userId: string): Promise<void> {
    const search = await this.searcher.searchDeleteAccount(accountId, userId);
    const queryRunner = await this.transaction.init();
    this.handler.setQueryRunner(queryRunner);

    try {
      await this.context.deleteAccountContext(search);
      await this.handler.commit();
    } catch (err) {
      await this.handler.rollback(err);
    } finally {
      await this.handler.release();
    }
  }

  public async setMainAccount(accountId: string, userId: string): Promise<void> {
    const queryRunner = await this.transaction.init();
    this.handler.setQueryRunner(queryRunner);

    try {
      await this.context.setMainAccountContext(accountId, userId);
      await this.handler.commit();
    } catch (err) {
      await this.handler.rollback(err);
    } finally {
      await this.handler.release();
    }
  }
}
