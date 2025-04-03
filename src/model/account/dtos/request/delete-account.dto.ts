import { AccountEntity } from "../../entities/account.entity";

export class DeleteAccountDto {
  public excludeAccounts: AccountEntity[];
  public account: AccountEntity;
  public userId: string;
}
