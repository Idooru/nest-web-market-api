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

  async isExistUserEmail(email: string): Promise<void> {
    const result = await this.userVerifyRepository.isExistUserEmail(email);

    if (!result) {
      throw new BadRequestException(
        "해당 이메일은 데이터베이스에 존재하지 않습니다.",
      );
    }
  }

  async isNotExistUserEmail(email: string): Promise<void> {
    const result = await this.userVerifyRepository.isNotExistUserEmail(email);

    if (!result) {
      throw new BadRequestException("해당 이메일은 데이터베이스에 존재합니다.");
    }
  }

  async isExistUserRealName(realname: string): Promise<void> {
    const result = await this.userVerifyRepository.isExistUserRealName(
      realname,
    );

    if (!result) {
      throw new BadRequestException(
        "해당 실명은 데이터베이스에 존재하지 않습니다.",
      );
    }
  }

  async isNotExistUserNickName(nickname: string): Promise<void> {
    const result = await this.userVerifyRepository.isNotExistUserNickName(
      nickname,
    );

    if (!result) {
      throw new BadRequestException("해당 닉네임은 데이터베이스에 존재합니다.");
    }
  }

  async isExistUserPhoneNumber(phonenumber: string): Promise<void> {
    const result = await this.userVerifyRepository.isExistUserPhoneNumber(
      phonenumber,
    );

    if (!result) {
      throw new BadRequestException(
        "해당 전화번호는 데이터베이스에 존재하지 않습니다.",
      );
    }
  }

  async isNotExistUserPhoneNumber(phonenumber: string): Promise<void> {
    const result = await this.userVerifyRepository.isNotExistUserPhoneNumber(
      phonenumber,
    );

    if (!result) {
      throw new BadRequestException(
        "해당 전화번호는 데이터베이스에 존재합니다.",
      );
    }
  }
}
