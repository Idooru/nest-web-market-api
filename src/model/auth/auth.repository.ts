import { UserCoreEntity } from "src/model/user/entities/user.core.entity";
import { UnauthorizedException } from "@nestjs/common";
import { UserAuthEntity } from "../user/entities/user.auth.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserObjects } from "src/common/config/etc";

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UserAuthEntity)
    private readonly authRepository: Repository<UserAuthEntity>,
    @InjectRepository(UserCoreEntity)
    private readonly userRepository: Repository<UserCoreEntity>,
  ) {}

  async findUserWithEmail(email: string): Promise<UserCoreEntity> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { auth: { email } },
        relations: UserObjects,
      });
    } catch (err) {
      throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
    }
  }

  async isExistUserWithRealName(realname: string): Promise<UserCoreEntity> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { common: { realname } },
        relations: UserObjects,
      });
    } catch (err) {
      throw new UnauthorizedException("해당 이름(실명)은 존재하지 않습니다.");
    }
  }

  async isExistUserWithPhoneNumber(
    phonenumber: string,
  ): Promise<UserCoreEntity> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { common: { phonenumber } },
        relations: UserObjects,
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
