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
    if (value.email && value.nickname && value.phonenumber) {
      await this.validateAll(value);
    } else if (value.email) {
      await this.validateEmail(value);
    } else if (value.nickname) {
      await this.validateNickname(value);
    } else if (value.phonenumber) {
      await this.validatePhonenumber(value);
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

  private async validateEmail({ email }: T): Promise<void> {
    await this.userValidator.isNoneExistEmail(email);
  }

  private async validateNickname({ nickname }: T): Promise<void> {
    await this.userValidator.isNoneExistNickname(nickname);
  }

  private async validatePhonenumber({ phonenumber }: T): Promise<void> {
    await this.userValidator.isNoneExistPhonenumber(phonenumber);
  }
}
