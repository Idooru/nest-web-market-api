import { UsersEntity } from "../../user/entities/user.entity";
import { UnauthorizedException } from "@nestjs/common";
import { UserAuthEntity } from "../../user/entities/user.auth.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly authRepository: Repository<UserAuthEntity>,
  ) {}

  async findUserWithEmail(email: string): Promise<UsersEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.Profile", "Profile")
        .leftJoinAndSelect("user.Auth", "Auth")
        .leftJoinAndSelect("user.Activity", "Activity")
        .where("Auth.email = :email", { email })
        .getOneOrFail();
    } catch (err) {
      throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
    }
  }

  async findUserWithRealName(realname: string): Promise<UsersEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.Profile", "Profile")
        .leftJoinAndSelect("user.Auth", "Auth")
        .leftJoinAndSelect("user.Activity", "Activity")
        .where("Profile.realname = :realname", { realname })
        .getOneOrFail();
    } catch (err) {
      throw new UnauthorizedException("해당 이름(실명)은 존재하지 않습니다.");
    }
  }

  async findUserWithPhoneNumber(phonenumber: string): Promise<UsersEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.Profile", "Profile")
        .leftJoinAndSelect("user.Auth", "Auth")
        .leftJoinAndSelect("user.Activity", "Activity")
        .where("Profile.phonenumber = :phonenumber", { phonenumber })
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
