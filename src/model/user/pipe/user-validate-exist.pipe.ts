import { Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../logic/user.validator";

type UserFeild = {
  id?: string;
  email?: string;
  nickname?: string;
  phonenumber?: string;
};

@Injectable()
export class UserValidateExistPipe<T extends UserFeild>
  implements PipeTransform
{
  constructor(private readonly userValidator: UserValidator) {}

  public async transform(value: T): Promise<T> {
    if (value.id) {
      await this.validateId(value);
    } else if (value.email) {
      await this.validateEmail(value);
    } else if (value.nickname) {
      await this.validateNickanme(value);
    } else if (value.phonenumber) {
      await this.validatePhonenumber(value);
    }

    return value;
  }

  private async validateId({ id }: T): Promise<void> {
    await this.userValidator.isExistId(id);
  }

  private async validateEmail({ email }: T): Promise<void> {
    await this.userValidator.isExistEmail(email);
  }

  private async validateNickanme({ nickname }: T): Promise<void> {
    await this.userValidator.isExistNickname(nickname);
  }

  private async validatePhonenumber({ phonenumber }: T): Promise<void> {
    await this.userValidator.isExistPhoneNumber(phonenumber);
  }
}
