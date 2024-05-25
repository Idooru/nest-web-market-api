import { Injectable, PipeTransform } from "@nestjs/common";
import { AccountBodyDto } from "../../dtos/account-body.dto";
import { AccountValidator } from "../../logic/account.validator";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

@Injectable()
export class AccountValidatePipe implements PipeTransform {
  constructor(private readonly accountValidator: AccountValidator) {}

  @Implemented
  public async transform(dto: AccountBodyDto): Promise<AccountBodyDto> {
    const { accountNumber } = dto;

    await this.accountValidator.isNoneExistAccountNumber(accountNumber);

    return dto;
  }
}
