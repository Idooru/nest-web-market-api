import { Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../../logic/user.validator";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

type NickName = {
  nickName: string;
};

@Injectable()
export class UserNicknameValidatePipe implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  @Implemented
  public async transform({ nickName }: NickName): Promise<NickName> {
    await this.userValidator.isNoneExistNickname(nickName);

    return { nickName };
  }
}
