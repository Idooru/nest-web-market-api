import { Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../../logic/user.validator";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

type PhoneNumber = {
  phoneNumber: string;
};

@Injectable()
export class UserBodyPhoneNumberValidatePipe implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  @Implemented
  public async transform({ phoneNumber }: { phoneNumber: string }): Promise<PhoneNumber> {
    await this.userValidator.isNoneExistPhoneNumber(phoneNumber);

    return { phoneNumber };
  }
}
