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

  public validateId(id: string): Promise<boolean> {
    return this.accountRepository.exist({ where: { id } });
  }

  public validateAccountNumber(accountNumber: string): Promise<boolean> {
    return this.accountRepository.exist({ where: { accountNumber } });
  }
}
