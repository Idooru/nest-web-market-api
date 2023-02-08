import { Injectable } from "@nestjs/common";
import { UserExistRepository } from "../../user/providers/user-exist.repository";
import bcrypt from "bcrypt";

@Injectable()
export class AuthExistService {
  constructor(private readonly userExistRepository: UserExistRepository) {}

  async verfiyRealNameAndPhoneNumber(
    realname: string,
    phonenumber: string,
  ): Promise<[boolean, boolean]> {
    return await Promise.all([
      this.userExistRepository.isExistRealName(realname),
      this.userExistRepository.isExistPhoneNumber(phonenumber),
    ]);
  }

  async verfiyEmail(email: string): Promise<boolean> {
    return await this.userExistRepository.isExistEmail(email);
  }

  async verfiyPassword(
    password: string,
    existPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, existPassword);
  }
}
