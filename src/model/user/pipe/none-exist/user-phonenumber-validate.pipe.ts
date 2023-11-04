import { Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../../logic/user.validator";

type PhoneNumber = {
  phonenumber: string;
};

@Injectable()
export class UserPhonenumberValidatePipe implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  public async transform({ phonenumber }: PhoneNumber): Promise<PhoneNumber> {
    await this.userValidator.isNoneExistPhonenumber(phonenumber);

    return { phonenumber };
  }
}
