import { ForbiddenException, Injectable } from "@nestjs/common";
import { CreateAccountDto } from "../dtos/create-account.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountEntity } from "../entities/account.entity";
import { QueryFailedError, Repository } from "typeorm";
import { MoneyTransactionDto } from "../dtos/money-transaction.dto";
import { loggerFactory } from "../../../common/functions/logger.factory";
import { General } from "../../../common/decorators/general.decoration";

@Injectable()
export class AccountUpdateRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  @General
  public async createAccount(dto: CreateAccountDto): Promise<void> {
    const { user, isFirst } = dto;

    await this.accountRepository.save({
      ...dto.accountBodyDto,
      isMainAccount: isFirst,
      User: user,
    });
  }

  @General
  public async deleteAccount(accountId: string): Promise<void> {
    await this.accountRepository.delete(accountId);
  }

  @General
  public async disableAllAccount(userId: string): Promise<void> {
    await this.accountRepository
      .createQueryBuilder()
      .update(AccountEntity)
      .set({ isMainAccount: false })
      .where("userId = :userId", { userId })
      .execute();
  }

  @General
  public async setMainAccount(accountId: string): Promise<void> {
    await this.accountRepository
      .createQueryBuilder()
      .update(AccountEntity)
      .set({ isMainAccount: true })
      .where("id = :accountId", { accountId })
      .execute();
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
