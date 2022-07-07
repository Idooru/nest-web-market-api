import { UserEntity } from "../../user/entities/user.entity";
import { UnauthorizedException } from "@nestjs/common";
import { UserAuthEntity } from "../../user/entities/user.auth.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

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
      return await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.profile", "profile")
        .leftJoinAndSelect("user.auth", "auth")
        .leftJoinAndSelect("user.activity", "activity")
        .where("auth.email = :email", { email })
        .getOneOrFail();
    } catch (err) {
      throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
    }
  }

  async findUserWithRealName(realname: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.profile", "profile")
        .leftJoinAndSelect("user.auth", "auth")
        .leftJoinAndSelect("user.activity", "activity")
        .where("profile.realname = :realname", { realname })
        .getOneOrFail();
    } catch (err) {
      throw new UnauthorizedException("해당 이름(실명)은 존재하지 않습니다.");
    }
  }

  async findUserWithPhoneNumber(phonenumber: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.profile", "profile")
        .leftJoinAndSelect("user.auth", "auth")
        .leftJoinAndSelect("user.activity", "activity")
        .where("profile.phonenumber = :phonenumber", { phonenumber })
        .getOneOrFail();
    } catch (err) {
      throw new UnauthorizedException("해당 전화번호는 존재하지 않습니다.");
    }
  }

  async resetPassword(userId: string, hashed: string) {
    const password = { password: hashed };
    await this.authRepository.update(userId, password);
  }
}
