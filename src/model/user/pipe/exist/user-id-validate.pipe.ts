import { Injectable, PipeTransform } from "@nestjs/common";
import { Implemented } from "src/common/decorators/implemented.decoration";
import { UserValidator } from "../../logic/user.validator";

@Injectable()
export class UserIdValidatePipe implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  @Implemented
  public async transform(userId: string): Promise<string> {
    await this.userValidator.isExistId(userId);

    return userId;
  }
}
