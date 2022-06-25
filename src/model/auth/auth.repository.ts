import { UnauthorizedException } from "@nestjs/common";
import { UserAuthEntity } from "../user/entities/user.auth.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UserAuthEntity)
    private readonly authRepository: Repository<UserAuthEntity>, // @InjectRepository(UserAuthEntity) // private readonly userAuthRepository: Repository<>,
  ) {}

  async findUserWithEmail(email: string): Promise<UserAuthEntity> {
    try {
      return await this.authRepository.findOneOrFail({ where: { email } });
    } catch (err) {
      throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
    }
  }

  async isExistUserWithRealName(realName: string): Promise<UserAuthEntity> {
    try {
      return await this.authRepository.findOneOrFail({
        select: ["id", "email"],
        where: { realName },
      });
    } catch (err) {
      throw new UnauthorizedException("해당 이름(실명)은 존재하지 않습니다.");
    }
  }

  async isExistUserWithPhoneNumber(
    phoneNumber: string,
  ): Promise<UserAuthEntity> {
    try {
      return await this.authRepository.findOneOrFail({
        select: ["id"],
        where: { phoneNumber },
      });
    } catch (err) {
      throw new UnauthorizedException("해당 전화번호는 존재하지 않습니다.");
    }
  }

  async resetPassword(id: string, hashed: string) {
    const password = { password: hashed };
    await this.authRepository.update(id, password);
  }
}
