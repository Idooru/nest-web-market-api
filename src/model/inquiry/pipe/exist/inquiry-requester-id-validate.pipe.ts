import { Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../../../user/logic/user.validator";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

@Injectable()
export class InquiryRequesterIdValidatePipe implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  @Implemented
  public async transform(id: string): Promise<string> {
    await this.userValidator.isExistClientUserId(id);

    return id;
  }
}
