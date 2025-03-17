import { Injectable, PipeTransform } from "@nestjs/common";
import { Implemented } from "../../../../common/decorators/implemented.decoration";
import { UserValidator } from "../../logic/user.validator";

@Injectable()
export class UserEmailValidatePipe<T extends { email: string }> implements PipeTransform {
  constructor(private readonly validator: UserValidator) {}

  @Implemented
  public async transform(dto: T): Promise<T> {
    const { email } = dto;
    await this.validator.isExistEmail(email);

    return dto;
  }
}
