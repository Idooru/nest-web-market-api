import { Injectable } from "@nestjs/common";
import { AccountSearchRepository } from "../repositories/account-search.repository";
import { AccountEntity } from "../entities/account.entity";

@Injectable()
export class AccountSearcher {
  constructor(private readonly accountSearchRepository: AccountSearchRepository) {}

  public findAccountsWithUserId(id: string): Promise<AccountEntity[]> {
    return this.accountSearchRepository.findAccountsWithUserId(id);
  }

  public findMainAccountWithUserId(id: string): Promise<AccountEntity> {
    return this.accountSearchRepository.findMainAccountWithUserId(id);
  }
}
