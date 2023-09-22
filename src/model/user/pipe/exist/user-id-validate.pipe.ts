import { Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../../logic/user.validator";

@Injectable()
export class UserIdValidatePipe implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  public async transform(id: string): Promise<string> {
    await this.userValidator.isExistId(id);

    return id;
  }
}
