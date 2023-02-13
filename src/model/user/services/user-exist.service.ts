import { BadRequestException, Injectable } from "@nestjs/common";
import { UserExistRepository } from "../repositories/user-exist.repository";

@Injectable()
export class UserExistService {
  constructor(private readonly userExistRepository: UserExistRepository) {}

  async isExistUserId(id: string): Promise<void> {
    const result = await this.userExistRepository.isExistUserId(id);

    if (!result) {
      throw new BadRequestException(
        "해당 사용자 아이디는 데이터베이스에 존재하지 않습니다.",
      );
    }
  }

  async isExistEmail(email: string): Promise<void> {
    const result = await this.userExistRepository.isExistEmail(email);

    if (!result) {
      throw new BadRequestException(
        "해당 이메일은 데이터베이스에 존재하지 않습니다.",
      );
    }
  }

  async isNotExistEmail(email: string): Promise<void> {
    const result = await this.userExistRepository.isNotExistEmail(email);

    if (!result) {
      throw new BadRequestException("해당 이메일은 데이터베이스에 존재합니다.");
    }
  }

  async isNotExistNickName(nickname: string): Promise<void> {
    const result = await this.userExistRepository.isNotExistNickName(nickname);

    if (!result) {
      throw new BadRequestException("해당 닉네임은 데이터베이스에 존재합니다.");
    }
  }

  async isExistPhoneNumber(phonenumber: string): Promise<void> {
    const result = await this.userExistRepository.isExistPhoneNumber(
      phonenumber,
    );

    if (!result) {
      throw new BadRequestException(
        "해당 전화번호는 데이터베이스에 존재하지 않습니다.",
      );
    }
  }

  async isNotExistPhoneNumber(phonenumber: string): Promise<void> {
    const result = await this.userExistRepository.isNotExistPhoneNumber(
      phonenumber,
    );

    if (!result) {
      throw new BadRequestException(
        "해당 전화번호는 데이터베이스에 존재합니다.",
      );
    }
  }
}
