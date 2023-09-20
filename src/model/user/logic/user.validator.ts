import { Injectable } from "@nestjs/common";
import { UserValidateRepository } from "../repositories/user-validate.repository";
import { ValidateLibrary } from "../../../common/lib/util/validate.library";

@Injectable()
export class UserValidator {
  constructor(
    private readonly userValidateRepository: UserValidateRepository,
    private readonly validateLibrary: ValidateLibrary,
  ) {}

  async isExistId(id: string): Promise<void> {
    const result = await this.userValidateRepository.isExistId(id);
    this.validateLibrary.isExistData(result, "id", id);
  }

  async isExistEmail(email: string): Promise<void> {
    const result = await this.userValidateRepository.isExistEmail(email);
    this.validateLibrary.isExistData(result, "email", email);
  }

  async isExistNickname(nickname: string): Promise<void> {
    const result = await this.userValidateRepository.isExistNickname(nickname);
    this.validateLibrary.isExistData(result, "nickname", nickname);
  }

  async isExistPhoneNumber(phonenumber: string): Promise<void> {
    const result = await this.userValidateRepository.isExistPhoneNumber(
      phonenumber,
    );
    this.validateLibrary.isExistData(result, "phonenumber", phonenumber);
  }

  async isNoneExistEmail(email: string): Promise<void> {
    const result = await this.userValidateRepository.isNoneExistEmail(email);
    this.validateLibrary.isNoneExistData(result, "email", email);
  }

  async isNoneExistNickname(nickname: string): Promise<void> {
    const result = await this.userValidateRepository.isNoneExistNickname(
      nickname,
    );
    this.validateLibrary.isNoneExistData(result, "nickname", nickname);
  }

  async isNoneExistPhonenumber(phonenumber: string): Promise<void> {
    const result = await this.userValidateRepository.isNoneExistPhonenumber(
      phonenumber,
    );
    this.validateLibrary.isNoneExistData(result, "phonenumber", phonenumber);
  }
}
