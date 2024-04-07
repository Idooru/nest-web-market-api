import { Injectable } from "@nestjs/common";
import { UserValidateRepository } from "../repositories/user-validate.repository";
import { ValidateLibrary } from "../../../common/lib/util/validate.library";

@Injectable()
export class UserValidator {
  constructor(
    private readonly userValidateRepository: UserValidateRepository,
    private readonly validateLibrary: ValidateLibrary,
  ) {}

  public async isExistId(id: string): Promise<void> {
    const result = await this.userValidateRepository.isExistId(id);
    this.validateLibrary.isExistData(result, "user id", id);
  }

  public async isExistClientUserId(id: string): Promise<void> {
    const result = await this.userValidateRepository.isExistClientUserId(id);
    this.validateLibrary.isExistData(result, "client id", id);
  }

  public async isNoneExistEmail(email: string): Promise<void> {
    const result = await this.userValidateRepository.isNoneExistEmail(email);
    this.validateLibrary.isNoneExistData(result, "user email", email);
  }

  public async isNoneExistNickname(nickname: string): Promise<void> {
    const result = await this.userValidateRepository.isNoneExistNickname(nickname);
    this.validateLibrary.isNoneExistData(result, "user nickname", nickname);
  }

  public async isNoneExistPhonenumber(phonenumber: string): Promise<void> {
    const result = await this.userValidateRepository.isNoneExistPhonenumber(phonenumber);
    this.validateLibrary.isNoneExistData(result, "user phonenumber", phonenumber);
  }
}
