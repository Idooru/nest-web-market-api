import { Injectable, PipeTransform } from "@nestjs/common";
import { AccountBodyDto } from "../../dtos/account-body.dto";
import { AccountValidator } from "../../logic/account.validator";

@Injectable()
export class AccountValidatePipe implements PipeTransform {
  constructor(private readonly accountValidator: AccountValidator) {}

  public async transform(body: AccountBodyDto): Promise<AccountBodyDto> {
    const { accountNumber } = body;

    await this.accountValidator.isNoneExistAccountNumber(accountNumber);

    return body;
  }
}
