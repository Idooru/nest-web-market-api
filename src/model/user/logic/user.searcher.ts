import { Injectable } from "@nestjs/common";
import { UserSearchRepository } from "../repositories/user-search.repository";
import { UserEntity } from "../entities/user.entity";
import { ValidateLibrary } from "src/common/lib/util/validate.library";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";

@Injectable()
export class UserSearcher {
  constructor(
    private readonly userSearchRepository: UserSearchRepository,
    private readonly validateLibrary: ValidateLibrary,
  ) {}

  async findUserWithId(id: string): Promise<UserEntity> {
    const user = await this.userSearchRepository.findUserWithId(id);
    this.validateLibrary.isExistData(user);
    return user;
  }

  async findUserWithEmail(email: string): Promise<UserEntity> {
    const user = await this.userSearchRepository.findUserWithEmail(email);
    this.validateLibrary.isExistData(user);
    return user;
  }

  async findAllUsersFromLatest(): Promise<UserEntity[]> {
    const users = await this.userSearchRepository.findAllUsersFromLatest();
    this.validateLibrary.isExistArray(users);
    return users;
  }

  async findAllUsersFromOldest(): Promise<UserEntity[]> {
    const users = await this.userSearchRepository.findAllUsersFromOldest();
    this.validateLibrary.isExistArray(users);
    return users;
  }

  async findClientUserInfo(id: string): Promise<UserEntity> {
    const clientUser = await this.userSearchRepository.findClientUserInfo(id);
    this.validateLibrary.isExistData(clientUser);
    return clientUser;
  }

  async findUserProfile(
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<[string, UserEntity]> {
    if (jwtPayload.userRole.toString() === "admin") {
      const adminUser =
        await this.userSearchRepository.findAdminUserProfileInfoWithId(
          jwtPayload.userId,
        );
      this.validateLibrary.isExistData(adminUser);
      return ["관리자 사용자의 정보를 가져옵니다.", adminUser];
    } else {
      const clientUser =
        await this.userSearchRepository.findClientUserProfileInfoWithId(
          jwtPayload.userId,
        );
      this.validateLibrary.isExistData(clientUser);
      return ["고객 사용자의 정보를 가져옵니다.", clientUser];
    }
  }

  async findUserForgotten(realname: string, phonenumber: string) {
    const user = await this.userSearchRepository.findUserForgotten(
      realname,
      phonenumber,
    );
    this.validateLibrary.isExistData(user);
    return user;
  }
}
