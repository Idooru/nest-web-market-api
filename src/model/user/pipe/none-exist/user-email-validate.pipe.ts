import { Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../../logic/user.validator";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

type Email = {
  email: string;
};

@Injectable()
export class UserEmailValidatePipe implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  @Implemented
  public async transform({ email }: Email): Promise<Email> {
    await this.userValidator.isNoneExistEmail(email);

    return { email };
  }
}
