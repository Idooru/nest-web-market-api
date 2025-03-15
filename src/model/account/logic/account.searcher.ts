import { Injectable } from "@nestjs/common";
import { AccountSearchRepository } from "../repositories/account-search.repository";
import { AccountEntity } from "../entities/account.entity";

@Injectable()
export class AccountSearcher {
  constructor(private readonly accountSearchRepository: AccountSearchRepository) {}

  public findAccounts(id: string): Promise<AccountEntity[]> {
    return this.accountSearchRepository.findAccounts(id);
  }

  public findMainAccount(id: string): Promise<AccountEntity> {
    return this.accountSearchRepository.findMainAccount(id);
  }

  public findAccount(id: string): Promise<AccountEntity> {
    return this.accountSearchRepository.findAccount(id);
  }
}
