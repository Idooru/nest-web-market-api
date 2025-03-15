import { Repository } from "typeorm";
import { AccountEntity } from "../../entities/account.entity";

export interface AccountRepositoryPayload {
  account: Repository<AccountEntity>;
}
