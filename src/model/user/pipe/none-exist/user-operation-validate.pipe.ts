import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../../logic/user.validator";

type UserBody = {
  email: string;
  nickname: string;
  phonenumber: string;
};

@Injectable()
export class UserOperationValidatePipe<T extends UserBody>
  implements PipeTransform
{
  constructor(private readonly userValidator: UserValidator) {}

  public async transform(body: T): Promise<T> {
    const { email, nickname, phonenumber } = body;

    const validResult = await Promise.allSettled([
      this.userValidator.isNoneExistEmail(email),
      this.userValidator.isNoneExistNickname(nickname),
      this.userValidator.isNoneExistPhonenumber(phonenumber),
    ]);

    const errors = validResult.filter((item) => item.status === "rejected");

    if (errors.length) {
      throw new BadRequestException(errors);
    }

    return body;
  }
}
