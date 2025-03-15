import { ForbiddenException, Injectable } from "@nestjs/common";
import { AccountSearcher } from "../account.searcher";
import { DeleteAccountDto } from "../../dtos/delete-account.dto";
import { UserSearcher } from "src/model/user/logic/user.searcher";
import { CreateAccountDto } from "../../dtos/create-account.dto";
import { loggerFactory } from "src/common/functions/logger.factory";
import { AccountBody } from "../../dtos/account-body.dto";

@Injectable()
export class AccountTransactionSearcher {
  constructor(private readonly userSearcher: UserSearcher, private readonly accountSearcher: AccountSearcher) {}

  public async searchCreateAccount(userId: string, body: AccountBody): Promise<CreateAccountDto> {
    const user = await this.userSearcher.findUserWithId(userId);
    const accounts = await this.accountSearcher.findAccounts(userId);

    if (accounts.length >= 4) {
      const message = "더 이상 계좌를 추가 할 수 없습니다.";
      loggerFactory("Too Many Accounts").error(message);
      throw new ForbiddenException(message);
    }

    return { user, body };
  }

  public async searchDeleteAccount(accountId: string, userId: string): Promise<DeleteAccountDto> {
    const accounts = await this.accountSearcher.findAccounts(userId);
    const account = await this.accountSearcher.findAccount(accountId);
    const excludeAccounts = accounts.filter((account) => account.id !== accountId);
    return { account, excludeAccounts, userId };
  }
}
