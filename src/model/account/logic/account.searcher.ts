import { Injectable } from "@nestjs/common";
import { AccountSearchRepository } from "../repositories/account-search.repository";

@Injectable()
export class AccountSearcher {
  constructor(
    private readonly accountSearchRepository: AccountSearchRepository,
  ) {}

  public async findAccountsWithUserId(id: string) {
    return await this.accountSearchRepository.findAccountsWithUserId(id);
  }
}
