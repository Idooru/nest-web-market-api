import { Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../../logic/user.validator";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

type PhoneNumber = {
  phonenumber: string;
};

@Injectable()
export class UserPhonenumberValidatePipe implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  @Implemented
  public async transform({ phonenumber }: PhoneNumber): Promise<PhoneNumber> {
    await this.userValidator.isNoneExistPhonenumber(phonenumber);

    return { phonenumber };
  }
}
