import { Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../../logic/user.validator";

@Injectable()
export class UserPhonenumberValidatePipe implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  public async transform({
    phonenumber,
  }: {
    phonenumber: string;
  }): Promise<string> {
    await this.userValidator.isNoneExistPhonenumber(phonenumber);

    return phonenumber;
  }
}
