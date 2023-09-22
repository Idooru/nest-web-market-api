import { Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../../logic/user.validator";

@Injectable()
export class UserNicknameValidatePipe implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  public async transform({ nickname }: { nickname: string }): Promise<string> {
    await this.userValidator.isNoneExistNickname(nickname);

    return nickname;
  }
}
