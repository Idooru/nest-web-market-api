import { Injectable } from "@nestjs/common";
import { AccountSearchRepository } from "../repositories/account-search.repository";
import { AccountEntity } from "../entities/account.entity";

@Injectable()
export class AccountSearcher {
  constructor(
    private readonly accountSearchRepository: AccountSearchRepository,
  ) {}

  public async findAccountsWithUserId(id: string): Promise<AccountEntity[]> {
    return await this.accountSearchRepository.findAccountsWithUserId(id);
  }

  public async findMainAccountWithUserId(id: string): Promise<AccountEntity> {
    return await this.accountSearchRepository.findMainAccountWithUserId(id);
  }
}
