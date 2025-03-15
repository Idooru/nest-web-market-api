import { Injectable } from "@nestjs/common";
import { ValidateLibrary } from "../../../common/lib/util/validate.library";
import { AccountValidateRepository } from "../repositories/account-validate.repository";

@Injectable()
export class AccountValidator {
  constructor(
    private readonly accountValidateRepository: AccountValidateRepository,
    private readonly validateLibrary: ValidateLibrary,
  ) {}

  public async isExistId(id: string): Promise<void> {
    const result = await this.accountValidateRepository.validateId(id);
    this.validateLibrary.isExistData(result, "account id", id);
  }

  public async isNoneExistAccountNumber(accountNumber: string): Promise<void> {
    const result = await this.accountValidateRepository.validateAccountNumber(accountNumber);
    this.validateLibrary.isNoneExistData(result, "account number", accountNumber);
  }
}
