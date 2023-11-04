import { Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../../logic/user.validator";

type NickName = {
  nickname: string;
};

@Injectable()
export class UserNicknameValidatePipe implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  public async transform({ nickname }: NickName): Promise<NickName> {
    await this.userValidator.isNoneExistNickname(nickname);

    return { nickname };
  }
}
