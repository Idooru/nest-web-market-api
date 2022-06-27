import { UserEntity } from "../user/entities/user.entity";
import { UnauthorizedException } from "@nestjs/common";
import { UserAuthEntity } from "../user/entities/user.auth.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserObjectArray } from "src/common/config/etc";
import { Functions } from "../etc/providers/functions";

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly authRepository: Repository<UserAuthEntity>,
  ) {}

  async findUserWithEmail(email: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { auth: { email } },
        relations: UserObjectArray,
      });
    } catch (err) {
      throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
    }
  }

  async isExistUserWithRealName(realname: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { common: { realname } },
        relations: UserObjectArray,
      });
    } catch (err) {
      throw new UnauthorizedException("해당 이름(실명)은 존재하지 않습니다.");
    }
  }

  async isExistUserWithPhoneNumber(phonenumber: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { common: { phonenumber } },
        relations: UserObjectArray,
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
