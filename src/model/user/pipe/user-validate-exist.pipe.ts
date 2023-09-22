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
    const { id, email, nickname, phonenumber } = value;

    if (id) {
      await this.validateId(id);
    } else if (email) {
      await this.validateEmail(email);
    } else if (nickname) {
      await this.validateNickanme(nickname);
    } else if (phonenumber) {
      await this.validatePhonenumber(phonenumber);
    }

    return value;
  }

  private async validateId(id: string): Promise<void> {
    await this.userValidator.isExistId(id);
  }

  private async validateEmail(email: string): Promise<void> {
    await this.userValidator.isExistEmail(email);
  }

  private async validateNickanme(nickname: string): Promise<void> {
    await this.userValidator.isExistNickname(nickname);
  }

  private async validatePhonenumber(phonenumber: string): Promise<void> {
    await this.userValidator.isExistPhoneNumber(phonenumber);
  }
}
