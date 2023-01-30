import { UnauthorizedException, Injectable } from "@nestjs/common";
import { UserEntity } from "../../user/entities/user.entity";
import { UserAuthEntity } from "../../user/entities/user.auth.entity";
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
        .createQueryBuilder()
        .select(["user", "Auth"])
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.Activity", "Activity")
        .where("Auth.email = :email", { email })
        .getOneOrFail();
    } catch (err) {
      throw new UnauthorizedException("아이디 혹은 비밀번호가 틀렸습니다.");
    }
  }

  async findUserWithRealName(realname: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(["user", "Auth"])
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.Activity", "Activity")
        .where("Profile.realname = :realname", { realname })
        .getOneOrFail();
    } catch (err) {
      throw new UnauthorizedException("해당 이름(실명)은 존재하지 않습니다.");
    }
  }

  async findUserWithPhoneNumber(phonenumber: string): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select(["user", "Auth"])
        .from(UserEntity, "user")
        .innerJoin("user.Profile", "Profile")
        .innerJoin("user.Auth", "Auth")
        .innerJoin("user.Activity", "Activity")
        .where("Profile.phonenumber = :phonenumber", { phonenumber })
        .getOneOrFail();
    } catch (err) {
      throw new UnauthorizedException("해당 전화번호는 존재하지 않습니다.");
    }
  }

  async resetPassword(userAuthId: string, hashed: string) {
    const password = { password: hashed };
    await this.authRepository
      .createQueryBuilder()
      .update(UserAuthEntity)
      .set({ ...password })
      .where("id = :id", { id: userAuthId })
      .execute();
  }
}
