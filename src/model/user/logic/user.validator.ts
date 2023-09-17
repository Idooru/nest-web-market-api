import { UserSearcher } from "./user.searcher";
import { BadRequestException, Injectable } from "@nestjs/common";
import { UserValidateDto } from "../dtos/user-validate.dto";

@Injectable()
export class UserValidator {
  async validate(
    userSearcher: UserSearcher,
    userValidateDto: UserValidateDto,
  ): Promise<void> {
    const { email, nickname, phonenumber } = userValidateDto;

    const validResult = await Promise.allSettled([
      userSearcher.isInvalidUserEmail(email),
      userSearcher.isInvalidNickName(nickname),
      userSearcher.isInvalidUserPhoneNumber(phonenumber),
    ]);

    const errors = validResult.filter((item) => item.status === "rejected");

    if (errors.length) {
      throw new BadRequestException(errors);
    }
  }
}
