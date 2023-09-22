import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../logic/user.validator";

type UserFeild = {
  email?: string;
  nickname?: string;
  phonenumber?: string;
};

@Injectable()
export class UserValidateNoneExistPipe<T extends UserFeild>
  implements PipeTransform
{
  constructor(private readonly userValidator: UserValidator) {}

  public async transform(value: T): Promise<T> {
    const { email, nickname, phonenumber } = value;

    if (email && nickname && phonenumber) {
      await this.validateAll(value);
    } else if (email) {
      await this.validateEmail(email);
    } else if (nickname) {
      await this.validateNickname(nickname);
    } else if (phonenumber) {
      await this.validatePhonenumber(phonenumber);
    }

    return value;
  }

  private async validateAll(value: T): Promise<void> {
    const { email, nickname, phonenumber } = value;

    const validResult = await Promise.allSettled([
      this.userValidator.isNoneExistEmail(email),
      this.userValidator.isNoneExistNickname(nickname),
      this.userValidator.isNoneExistPhonenumber(phonenumber),
    ]);

    const errors = validResult.filter((item) => item.status === "rejected");

    if (errors.length) {
      throw new BadRequestException(errors);
    }
  }

  private async validateEmail(email: string): Promise<void> {
    await this.userValidator.isNoneExistEmail(email);
  }

  private async validateNickname(nickname: string): Promise<void> {
    await this.userValidator.isNoneExistNickname(nickname);
  }

  private async validatePhonenumber(phonenumber: string): Promise<void> {
    await this.userValidator.isNoneExistPhonenumber(phonenumber);
  }
}
