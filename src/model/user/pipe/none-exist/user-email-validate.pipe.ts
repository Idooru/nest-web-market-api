import { Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../../logic/user.validator";

@Injectable()
export class UserEmailValidatePipe implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  public async transform({ email }: { email: string }): Promise<string> {
    await this.userValidator.isNoneExistEmail(email);

    return email;
  }
}
