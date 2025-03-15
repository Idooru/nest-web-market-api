import { Injectable, PipeTransform } from "@nestjs/common";
import { AccountValidator } from "../../logic/account.validator";
import { Implemented } from "src/common/decorators/implemented.decoration";

@Injectable()
export class AccountIdValidatePipe implements PipeTransform {
  constructor(private readonly accountValidator: AccountValidator) {}

  @Implemented
  public async transform(accountId: string): Promise<string> {
    await this.accountValidator.isExistId(accountId);
    return accountId;
  }
}
