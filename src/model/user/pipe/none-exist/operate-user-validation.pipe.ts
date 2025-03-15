import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { Implemented } from "src/common/decorators/implemented.decoration";
import { UserValidator } from "../../logic/user.validator";

type Dto = {
  email: string;
  nickName: string;
  phoneNumber: string;
};

@Injectable()
export class OperateUserValidationPipe<T extends Dto> implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  @Implemented
  public async transform(dto: T): Promise<T> {
    const { email, nickName, phoneNumber } = dto;

    const validResult = await Promise.allSettled([
      this.userValidator.isNoneExistEmail(email),
      this.userValidator.isNoneExistNickname(nickName),
      this.userValidator.isNoneExistPhoneNumber(phoneNumber),
    ]);

    const errors = validResult.filter((item) => item.status === "rejected");

    if (errors.length) {
      throw new BadRequestException(errors);
    }

    return dto;
  }
}
