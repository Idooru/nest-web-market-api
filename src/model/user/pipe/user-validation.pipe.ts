import { UserSearcher } from "../logic/user.searcher";
import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

type UserFeild = {
  email?: string;
  nickname?: string;
  phonenumber?: string;
};

@Injectable()
export class UserValidationPipe<T extends UserFeild> implements PipeTransform {
  constructor(private readonly userSearcher: UserSearcher) {}

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
      this.userSearcher.isInvalidUserEmail(email),
      this.userSearcher.isInvalidNickName(nickname),
      this.userSearcher.isInvalidUserPhoneNumber(phonenumber),
    ]);

    const errors = validResult.filter((item) => item.status === "rejected");

    if (errors.length) {
      throw new BadRequestException(errors);
    }
  }

  private async validateEmail({ email }: T): Promise<void> {
    await this.userSearcher.isInvalidUserEmail(email);
  }

  private async validateNickname({ nickname }: T): Promise<void> {
    await this.userSearcher.isInvalidNickName(nickname);
  }

  private async validatePhonenumber({ phonenumber }: T): Promise<void> {
    await this.userSearcher.isInvalidUserPhoneNumber(phonenumber);
  }
}
