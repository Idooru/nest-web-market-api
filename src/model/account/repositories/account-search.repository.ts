import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountEntity } from "../entities/account.entity";
import { Repository } from "typeorm";

@Injectable()
export class AccountSearchRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  public findAccountsWithUserId(id: string): Promise<AccountEntity[]> {
    return this.accountRepository.createQueryBuilder("account").where("account.userId = :id", { id }).getMany();
  }

  public findMainAccountWithUserId(id: string): Promise<AccountEntity> {
    return this.accountRepository
      .createQueryBuilder("account")
      .where("account.userId = :id", { id })
      .andWhere("account.isMainAccount = :flag", { flag: 1 })
      .getOne();
  }
}
