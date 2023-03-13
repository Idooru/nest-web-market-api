import { Injectable } from "@nestjs/common";
import { UserVerifyRepository } from "src/model/user/repositories/user-verify.repository";
import bcrypt from "bcrypt";

@Injectable()
export class AuthExistService {
  constructor(private readonly userVerifyRepository: UserVerifyRepository) {}

  async verifyEmail(email: string): Promise<boolean> {
    return await this.userVerifyRepository.isExistUserEmail(email);
  }

  async verifyPassword(
    password: string,
    existPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, existPassword);
  }
}
