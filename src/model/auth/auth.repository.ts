import { UnauthorizedException } from "@nestjs/common";
import { UserEntity } from "./../user/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly authRepository: Repository<UserEntity>,
  ) {}

  async findUserWithEmail(email: string): Promise<UserEntity> {
    try {
      return await this.authRepository.findOneOrFail({ email });
    } catch (err) {
      throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
    }
  }

  async isExistUserWithRealName(realName: string): Promise<UserEntity> {
    try {
      return await this.authRepository.findOneOrFail({ realName });
    } catch (err) {
      throw new UnauthorizedException("해당 이름(실명)은 존재하지 않습니다.");
    }
  }

  async isExistUserWithPhoneNumber(phoneNumber: string): Promise<UserEntity> {
    try {
      return await this.authRepository.findOneOrFail({ phoneNumber });
    } catch (err) {
      throw new UnauthorizedException("해당 전화번호는 존재하지 않습니다.");
    }
  }

  async resetPassword(id: string, hashed: string) {
    const password = { password: hashed };
    await this.authRepository.update(id, password);
  }
}
