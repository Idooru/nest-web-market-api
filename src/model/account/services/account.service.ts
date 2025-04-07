import { Injectable } from "@nestjs/common";
import { AccountUpdateRepository } from "../repositories/account-update.repository";
import { AccountSearcher } from "../logic/account.searcher";
import { General } from "../../../common/decorators/general.decoration";
import { AccountEntity } from "../entities/account.entity";
import { MoneyTransactionDto } from "../dtos/request/money-transaction.dto";
import { DepositResultDto } from "../dtos/response/deposit-result.dto";
import { WithdrawResultDto } from "../dtos/response/withdraw-result.dto";

class EntityFinder {
  constructor(private readonly accountSearcher: AccountSearcher) {}

  public findAccount(accountId: string): Promise<AccountEntity> {
    return this.accountSearcher.findEntity({
      property: "account.id = :id",
      alias: { id: accountId },
      getOne: true,
    }) as Promise<AccountEntity>;
  }
}

@Injectable()
export class AccountService {
  private readonly entityFinder: EntityFinder;

  constructor(
    private readonly accountSearcher: AccountSearcher,
    private readonly updateRepository: AccountUpdateRepository,
  ) {
    this.entityFinder = new EntityFinder(this.accountSearcher);
  }

  @General
  public async deposit(dto: MoneyTransactionDto): Promise<DepositResultDto> {
    const [account, result] = await Promise.all([
      this.entityFinder.findAccount(dto.accountId),
      this.updateRepository.deposit(dto),
    ]);

    return {
      beforeBalance: account.balance,
      depositBalance: dto.balance,
      afterDepositBalance: result.balance,
    };
  }

  @General
  public async withdraw(dto: MoneyTransactionDto): Promise<WithdrawResultDto> {
    const [account, result] = await Promise.all([
      this.entityFinder.findAccount(dto.accountId),
      this.updateRepository.withdraw(dto),
    ]);

    return {
      beforeBalance: account.balance,
      withdrawBalance: dto.balance,
      afterWithdrawBalance: result.balance,
    };
  }
}
