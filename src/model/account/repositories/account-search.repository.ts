import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountEntity } from "../entities/account.entity";
import { Repository } from "typeorm";
import { AccountSelect } from "src/common/config/repository-select-configs/account.select";

@Injectable()
export class AccountSearchRepository {
  constructor(
    @Inject("account-select")
    private readonly accountSelect: AccountSelect,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  public findAccounts(userId: string): Promise<AccountEntity[]> {
    return this.accountRepository
      .createQueryBuilder()
      .select(this.accountSelect.account)
      .from(AccountEntity, "account")
      .where("account.userId = :userId", { userId })
      .getMany();
  }

  public findMainAccount(userId: string): Promise<AccountEntity> {
    return this.accountRepository
      .createQueryBuilder()
      .select(this.accountSelect.account)
      .from(AccountEntity, "account")
      .where("account.userId = :userId", { userId })
      .andWhere("account.isMainAccount = :flag", { flag: 1 })
      .getOne();
  }

  public findAccount(accountId: string): Promise<AccountEntity> {
    return this.accountRepository
      .createQueryBuilder()
      .select(this.accountSelect.account)
      .from(AccountEntity, "account")
      .where("account.id = :accountId", { accountId })
      .getOne();
  }
}
