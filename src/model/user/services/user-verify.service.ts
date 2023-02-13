import { BadRequestException, Injectable } from "@nestjs/common";
import { UserVerifyRepository } from "../repositories/user-verify.repository";

@Injectable()
export class UserVerifyService {
  constructor(private readonly userVerifyRepository: UserVerifyRepository) {}

  async isExistUserId(id: string): Promise<void> {
    const result = await this.userVerifyRepository.isExistUserId(id);

    if (!result) {
      throw new BadRequestException(
        "해당 사용자 아이디는 데이터베이스에 존재하지 않습니다.",
      );
    }
  }

  async isExistEmail(email: string): Promise<void> {
    const result = await this.userVerifyRepository.isExistEmail(email);

    if (!result) {
      throw new BadRequestException(
        "해당 이메일은 데이터베이스에 존재하지 않습니다.",
      );
    }
  }

  async isNotExistEmail(email: string): Promise<void> {
    const result = await this.userVerifyRepository.isNotExistEmail(email);

    if (!result) {
      throw new BadRequestException("해당 이메일은 데이터베이스에 존재합니다.");
    }
  }

  async isNotExistNickName(nickname: string): Promise<void> {
    const result = await this.userVerifyRepository.isNotExistNickName(nickname);

    if (!result) {
      throw new BadRequestException("해당 닉네임은 데이터베이스에 존재합니다.");
    }
  }

  async isExistPhoneNumber(phonenumber: string): Promise<void> {
    const result = await this.userVerifyRepository.isExistPhoneNumber(
      phonenumber,
    );

    if (!result) {
      throw new BadRequestException(
        "해당 전화번호는 데이터베이스에 존재하지 않습니다.",
      );
    }
  }

  async isNotExistPhoneNumber(phonenumber: string): Promise<void> {
    const result = await this.userVerifyRepository.isNotExistPhoneNumber(
      phonenumber,
    );

    if (!result) {
      throw new BadRequestException(
        "해당 전화번호는 데이터베이스에 존재합니다.",
      );
    }
  }
}
