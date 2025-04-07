import { Injectable, PipeTransform } from "@nestjs/common";
import { AccountBody } from "../../dtos/request/account-body.dto";
import { AccountValidator } from "../../logic/account.validator";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

@Injectable()
export class AccountNumberValidatePipe implements PipeTransform {
  constructor(private readonly accountValidator: AccountValidator) {}

  @Implemented
  public async transform(dto: AccountBody): Promise<AccountBody> {
    const { accountNumber } = dto;

    await this.accountValidator.isNoneExistAccountNumber(accountNumber);

    return dto;
  }
}
