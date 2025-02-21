import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { Implemented } from "src/common/decorators/implemented.decoration";
import { UserValidator } from "../../logic/user.validator";

type UserBody = {
  email: string;
  nickName: string;
  phoneNumber: string;
};

@Injectable()
export class UserOperationValidatePipe<T extends UserBody> implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  @Implemented
  public async transform(body: T): Promise<T> {
    const { email, nickName, phoneNumber } = body;

    const validResult = await Promise.allSettled([
      this.userValidator.isNoneExistEmail(email),
      this.userValidator.isNoneExistNickname(nickName),
      this.userValidator.isNoneExistPhonenumber(phoneNumber),
    ]);

    const errors = validResult.filter((item) => item.status === "rejected");

    if (errors.length) {
      throw new BadRequestException(errors);
    }

    return body;
  }
}
