import { ForbiddenException, Injectable } from "@nestjs/common";
import { AccountUpdateRepository } from "../repositories/account-update.repository";
import { UserSearcher } from "../../user/logic/user.searcher";
import { AccountBodyDto } from "../dtos/account-body.dto";
import { AccountSearcher } from "../logic/account.searcher";
import { loggerFactory } from "../../../common/functions/logger.factory";
import { MoneyTransactionDto } from "../dtos/money-transaction.dto";
import { DepositResultDto } from "../dtos/deposit-result.dto";
import { WithdrawResultDto } from "../dtos/withdraw-result.dto";
import { General } from "../../../common/decorators/general.decoration";

@Injectable()
export class AccountService {
  constructor(
    private readonly userSearcher: UserSearcher,
    private readonly accountSearcher: AccountSearcher,
    private readonly accountUpdateRepository: AccountUpdateRepository,
  ) {}

  @General
  public async createAccount(dto: AccountBodyDto, userId: string): Promise<void> {
    const user = await this.userSearcher.findUserWithId(userId);
    const accounts = await this.accountSearcher.findAccountsWithUserId(userId);

    if (accounts.length >= 4) {
      const message = "더 이상 계좌를 추가 할 수 없습니다.";
      loggerFactory("Too Many Accounts").error(message);
      throw new ForbiddenException(message);
    } else if (accounts.length) {
      await this.accountUpdateRepository.createAccount({
        accountBodyDto: dto,
        user,
        isFirst: false,
      });
    } else {
      await this.accountUpdateRepository.createAccount({
        accountBodyDto: dto,
        user,
        isFirst: true,
      });
    }
  }

  @General
  public async deleteAccount(accountId: string): Promise<void> {
    await this.accountUpdateRepository.deleteAccount(accountId);
  }

  @General
  public async setMainAccount(accountId: string, userId: string): Promise<void> {
    await this.accountUpdateRepository.disableAllAccount(userId);
    await this.accountUpdateRepository.setMainAccount(accountId);
  }

  @General
  public async deposit(dto: MoneyTransactionDto): Promise<DepositResultDto> {
    const result = await this.accountUpdateRepository.deposit(dto);

    return {
      depositBalance: dto.balance,
      afterDepositBalance: result.balance,
    };
  }

  @General
  public async withdraw(dto: MoneyTransactionDto): Promise<WithdrawResultDto> {
    const result = await this.accountUpdateRepository.withdraw(dto);

    return {
      withdrawBalance: dto.balance,
      afterWithdrawBalance: result.balance,
    };
  }
}
