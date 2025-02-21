import { Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../../logic/user.validator";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

type PhoneNumber = {
  phoneNumber: string;
};

@Injectable()
export class UserPhonenumberValidatePipe implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  @Implemented
  public async transform({ phoneNumber }: PhoneNumber): Promise<PhoneNumber> {
    await this.userValidator.isNoneExistPhonenumber(phoneNumber);

    return { phoneNumber };
  }
}
