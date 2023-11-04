import { Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../../logic/user.validator";

type Email = {
  email: string;
};

@Injectable()
export class UserEmailValidatePipe implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  public async transform({ email }: Email): Promise<Email> {
    await this.userValidator.isNoneExistEmail(email);

    return { email };
  }
}
