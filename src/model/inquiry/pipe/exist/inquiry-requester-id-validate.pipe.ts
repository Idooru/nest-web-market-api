import { Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../../../user/logic/user.validator";

@Injectable()
export class InquiryRequesterIdValidatePipe implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  public async transform(id: string): Promise<string> {
    await this.userValidator.isExistClientUserId(id);

    return id;
  }
}
