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
    const result = await this.userValidateRepository.validateId(id);
    this.validateLibrary.isExistData(result, "user id", id);
  }

  public async isExistClientUserId(id: string): Promise<void> {
    const result = await this.userValidateRepository.validateClientUserId(id);
    this.validateLibrary.isExistData(result, "client id", id);
  }

  public async isNoneExistEmail(email: string): Promise<void> {
    const result = await this.userValidateRepository.validateEmail(email);
    this.validateLibrary.isNoneExistData(result, "user email", email);
  }

  public async isNoneExistNickname(nickName: string): Promise<void> {
    const result = await this.userValidateRepository.validateNickName(nickName);
    this.validateLibrary.isNoneExistData(result, "user nick name", nickName);
  }

  public async isExistRealName(realName: string): Promise<void> {
    const result = await this.userValidateRepository.validateRealName(realName);
    this.validateLibrary.isExistData(result, "user real name", realName);
  }

  public async isExistPhoneNumber(phoneNumber: string): Promise<void> {
    const result = await this.userValidateRepository.validatePhonenumber(phoneNumber);
    this.validateLibrary.isExistData(result, "user phone number", phoneNumber);
  }

  public async isNoneExistPhoneNumber(phoneNumber: string): Promise<void> {
    const result = await this.userValidateRepository.validatePhonenumber(phoneNumber);
    this.validateLibrary.isNoneExistData(result, "user phone number", phoneNumber);
  }
}
