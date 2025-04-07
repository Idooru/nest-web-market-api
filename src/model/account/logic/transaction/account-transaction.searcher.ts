import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { AccountSearcher } from "../account.searcher";
import { UserSearcher } from "src/model/user/logic/user.searcher";
import { loggerFactory } from "src/common/functions/logger.factory";
import { UserEntity } from "../../../user/entities/user.entity";
import { AccountEntity } from "../../entities/account.entity";
import { AccountBody } from "../../dtos/request/account-body.dto";
import { CreateAccountDto } from "../../dtos/request/create-account.dto";
import { DeleteAccountDto } from "../../dtos/request/delete-account.dto";

class EntityFinder {
  constructor(
    private readonly userIdFilter: string,
    private readonly userSearcher: UserSearcher,
    private readonly accountSearcher: AccountSearcher,
  ) {}

  public findUser(userId: string): Promise<UserEntity> {
    return this.userSearcher.findEntity({
      property: this.userIdFilter,
      alias: { id: userId },
      getOne: true,
    }) as Promise<UserEntity>;
  }

  public findAccount(accountId: string): Promise<AccountEntity> {
    return this.accountSearcher.findEntity({
      property: "account.id = :id",
      alias: { id: accountId },
      getOne: true,
    }) as Promise<AccountEntity>;
  }

  public findAccounts(userId: string): Promise<AccountEntity[]> {
    return this.accountSearcher.findEntity({
      property: "account.userId = :id",
      alias: { id: userId },
      getOne: false,
    }) as Promise<AccountEntity[]>;
  }
}

@Injectable()
export class AccountTransactionSearcher {
  private readonly entityFinder: EntityFinder;

  constructor(
    @Inject("user-id-filter")
    private readonly userIdFilter: string,
    private readonly userSearcher: UserSearcher,
    private readonly accountSearcher: AccountSearcher,
  ) {
    this.entityFinder = new EntityFinder(this.userIdFilter, this.userSearcher, this.accountSearcher);
  }

  public async searchCreateAccount(userId: string, body: AccountBody): Promise<CreateAccountDto> {
    const [user, accounts] = await Promise.all([
      this.entityFinder.findUser(userId),
      this.entityFinder.findAccounts(userId),
    ]);

    if (accounts.length >= 4) {
      const message = "더 이상 계좌를 추가 할 수 없습니다.";
      loggerFactory("Too Many Accounts").error(message);
      throw new ForbiddenException(message);
    }

    return { user, body };
  }

  public async searchDeleteAccount(accountId: string, userId: string): Promise<DeleteAccountDto> {
    const [accounts, account] = await Promise.all([
      this.entityFinder.findAccounts(userId),
      this.entityFinder.findAccount(accountId),
    ]);

    const excludeAccounts = accounts.filter((account) => account.id !== accountId);
    return { account, excludeAccounts, userId };
  }
}
