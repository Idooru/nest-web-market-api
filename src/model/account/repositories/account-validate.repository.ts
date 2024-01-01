import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AccountEntity } from "../entities/account.entity";
import { Repository } from "typeorm";

@Injectable()
export class AccountValidateRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  public async isNoneExistAccountNumber(
    accountNumber: string,
  ): Promise<boolean> {
    return await this.accountRepository.exist({ where: { accountNumber } });
  }
}
