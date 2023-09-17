import { UserSearcher } from "../user.searcher";
import { BadRequestException, Injectable } from "@nestjs/common";
import { UserValidateDto } from "../../dtos/user-validate.dto";

@Injectable()
export class UserValidator {
  constructor(private readonly userSearcher: UserSearcher) {}

  async validate(userValidateDto: UserValidateDto): Promise<void> {
    const { email, nickname, phonenumber } = userValidateDto;

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
}
