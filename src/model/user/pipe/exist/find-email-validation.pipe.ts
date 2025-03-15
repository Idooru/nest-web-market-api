import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../../logic/user.validator";
import { Implemented } from "src/common/decorators/implemented.decoration";

type Dto = {
  realName: string;
  phoneNumber: string;
};

@Injectable()
export class FindEmailValidationPipe<T extends Dto> implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  @Implemented
  public async transform(dto: T): Promise<T> {
    const { realName, phoneNumber } = dto;

    const validResult = await Promise.allSettled([
      this.userValidator.isExistRealName(realName),
      this.userValidator.isExistPhoneNumber(phoneNumber),
    ]);

    const errors = validResult.filter((item) => item.status === "rejected");

    if (errors.length) {
      throw new BadRequestException(errors);
    }

    return dto;
  }
}
