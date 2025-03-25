import { Injectable, PipeTransform } from "@nestjs/common";
import { UserValidator } from "../../logic/user.validator";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

@Injectable()
export class ClientUserIdValidatePipe implements PipeTransform {
  constructor(private readonly userValidator: UserValidator) {}

  @Implemented
  public async transform(clientUserId: string): Promise<string> {
    await this.userValidator.isExistClientUserId(clientUserId);

    return clientUserId;
  }
}
