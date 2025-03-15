import { Injectable } from "@nestjs/common";
import { AccountUpdateRepository } from "../repositories/account-update.repository";
import { AccountSearcher } from "../logic/account.searcher";
import { MoneyTransactionDto } from "../dtos/money-transaction.dto";
import { DepositResultDto } from "../dtos/deposit-result.dto";
import { WithdrawResultDto } from "../dtos/withdraw-result.dto";
import { General } from "../../../common/decorators/general.decoration";

@Injectable()
export class AccountService {
  constructor(private readonly searcher: AccountSearcher, private readonly updateRepository: AccountUpdateRepository) {}

  @General
  public async deposit(dto: MoneyTransactionDto): Promise<DepositResultDto> {
    const account = await this.searcher.findAccount(dto.accountId);
    const result = await this.updateRepository.deposit(dto);

    return {
      beforeBalance: account.balance,
      depositBalance: dto.balance,
      afterDepositBalance: result.balance,
    };
  }

  @General
  public async withdraw(dto: MoneyTransactionDto): Promise<WithdrawResultDto> {
    const account = await this.searcher.findAccount(dto.accountId);
    const result = await this.updateRepository.withdraw(dto);

    return {
      beforeBalance: account.balance,
      withdrawBalance: dto.balance,
      afterWithdrawBalance: result.balance,
    };
  }
}
