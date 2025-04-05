import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountEntity } from "../entities/account.entity";
import { QueryFailedError, Repository } from "typeorm";
import { loggerFactory } from "../../../common/functions/logger.factory";
import { General } from "../../../common/decorators/general.decoration";
import { AccountRepositoryPayload } from "../logic/transaction/account-repository.payload";
import { Transactional } from "src/common/interfaces/initializer/transactional";
import { Transaction } from "src/common/decorators/transaction.decorator";
import { CreateAccountDto } from "../dtos/request/create-account.dto";
import { MoneyTransactionDto } from "../dtos/request/money-transaction.dto";

@Injectable()
export class AccountUpdateRepository {
  constructor(
    private readonly transaction: Transactional<AccountRepositoryPayload>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  @Transaction
  public async disableAllAccount(userId: string): Promise<void> {
    await this.transaction
      .getRepository()
      .account.createQueryBuilder()
      .update(AccountEntity)
      .set({ isMainAccount: false })
      .where("userId = :userId", { userId })
      .execute();
  }

  @Transaction
  public async setMainAccount({ accountId }: { accountId: string }): Promise<void> {
    await this.transaction
      .getRepository()
      .account.createQueryBuilder()
      .update(AccountEntity)
      .set({ isMainAccount: true })
      .where("id = :accountId", { accountId })
      .execute();
  }

  @Transaction
  public async createAccount(dto: CreateAccountDto): Promise<AccountEntity> {
    const { user, body } = dto;
    return await this.transaction.getRepository().account.save({
      ...body,
      User: user,
    });
  }

  @Transaction
  public async deleteAccount(accountId: string): Promise<void> {
    await this.transaction.getRepository().account.delete(accountId);
  }

  @General
  public async deposit(dto: MoneyTransactionDto): Promise<AccountEntity> {
    const { accountId, balance } = dto;
    await this.accountRepository
      .createQueryBuilder()
      .update(AccountEntity)
      .set({ balance: () => `balance + ${balance}` })
      .where("id = :id", { id: accountId })
      .execute();

    return this.accountRepository.findOneBy({ id: accountId });
  }

  @General
  public async withdraw(dto: MoneyTransactionDto): Promise<AccountEntity> {
    const { accountId, balance } = dto;
    await this.accountRepository
      .createQueryBuilder()
      .update(AccountEntity)
      .set({ balance: () => `balance - ${balance}` })
      .where("id = :id", { id: accountId })
      .execute()
      .catch((err: QueryFailedError) => {
        if (err.message.includes("BIGINT UNSIGNED value is out of range in")) {
          const message = "현재 잔액보다 더 많은 금액을 출금 할 수 없습니다.";
          loggerFactory("overflow withdraw").error(message);
          throw new ForbiddenException(message);
        }
      });

    return this.accountRepository.findOneBy({ id: accountId });
  }
}
