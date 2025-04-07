import { Injectable } from "@nestjs/common";
import { AccountSearchRepository } from "../repositories/account-search.repository";
import { AccountEntity } from "../entities/account.entity";
import { FindEntityArgs, Searcher } from "../../../common/interfaces/search/searcher";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { FindAllAccountsDto } from "../dtos/request/find-all-accounts.dto";
import { AccountBasicRawDto } from "../dtos/response/account-basic-raw.dto";

@Injectable()
export class AccountSearcher implements Searcher<AccountEntity, FindAllAccountsDto, AccountBasicRawDto> {
  constructor(private readonly accountSearchRepository: AccountSearchRepository) {}

  @Implemented
  public findEntity(args: FindEntityArgs): Promise<AccountEntity | AccountEntity[]> {
    const { property, alias, getOne, entities } = args;
    if (entities && entities.length) {
      return this.accountSearchRepository.findOptionalEntity({ property, alias, entities, getOne });
    }
    return this.accountSearchRepository.findPureEntity({ property, alias, getOne });
  }

  @Implemented
  public async findAllRaws(dto: FindAllAccountsDto): Promise<AccountBasicRawDto[]> {
    return this.accountSearchRepository.findAllRaws(dto);
  }
}
