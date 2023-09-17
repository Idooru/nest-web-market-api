import { Injectable } from "@nestjs/common";
import { UserSearchRepository } from "../repositories/user-search.repository";
import { UserEntity } from "../entities/user.entity";
import { ValidateLibrary } from "src/common/lib/util/validate.library";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { ClientUserEntity } from "../entities/client-user.entity";
import { AdminUserEntity } from "../entities/admin-user.entity";

@Injectable()
export class UserSearcher {
  constructor(
    private readonly userSearchRepository: UserSearchRepository,
    private readonly validateLibrary: ValidateLibrary,
  ) {}

  async isInvalidUserEmail(email: string): Promise<void> {
    const boolean = await this.userSearchRepository.isInvalidUserEmail(email);
    this.validateLibrary.isNoneExistData(boolean, "email");
  }

  async isInvalidNickName(nickname: string): Promise<void> {
    const boolean = await this.userSearchRepository.isInvalidUserNickName(
      nickname,
    );
    this.validateLibrary.isNoneExistData(boolean, "nickname");
  }

  async isInvalidUserPhoneNumber(phonenumber: string): Promise<void> {
    const boolean = await this.userSearchRepository.isInvalidUserPhoneNumber(
      phonenumber,
    );
    this.validateLibrary.isNoneExistData(boolean, "phone number");
  }

  async findUserWithId(id: string): Promise<UserEntity> {
    const user = await this.userSearchRepository.findUserWithId(id);
    this.validateLibrary.isExistData(user, "user id");
    return user;
  }

  async findUserWithEmail(email: string): Promise<UserEntity> {
    const user = await this.userSearchRepository.findUserWithEmail(email);
    this.validateLibrary.isExistData(user, "email");
    return user;
  }

  async findUserWithNickname(nickname: string): Promise<UserEntity> {
    const user = await this.userSearchRepository.findUserWithNickname(nickname);
    this.validateLibrary.isExistData(user, "nickname");
    return user;
  }

  async findClientUserWithId(id: string): Promise<UserEntity> {
    const clientUser = await this.userSearchRepository.findClientUserWithId(id);
    this.validateLibrary.isExistData(clientUser, "user id");
    return clientUser;
  }

  async findAdminUserWithId(id: string): Promise<UserEntity> {
    const adminUser = await this.userSearchRepository.findAdminUserWithId(id);
    this.validateLibrary.isExistData(adminUser, "user id");
    return adminUser;
  }

  async findAllUsersFromLatest(): Promise<UserEntity[]> {
    const users = await this.userSearchRepository.findAllUsersFromLatest();
    this.validateLibrary.isExistArray(users, "users");
    return users;
  }

  async findAllUsersFromOldest(): Promise<UserEntity[]> {
    const users = await this.userSearchRepository.findAllUsersFromOldest();
    this.validateLibrary.isExistArray(users, "users");
    return users;
  }

  async findClientUserInfo(id: string): Promise<UserEntity> {
    const clientUser = await this.userSearchRepository.findClientUserInfo(id);
    this.validateLibrary.isExistData(clientUser, "client user");
    return clientUser;
  }

  async findClientUserObjectWithId(id: string): Promise<ClientUserEntity> {
    const clientObject =
      await this.userSearchRepository.findClientUserObjectWithId(id);
    this.validateLibrary.isExistData(clientObject, "client object");
    return clientObject;
  }

  async findAdminUserObjectWithId(id: string): Promise<AdminUserEntity> {
    const adminObject =
      await this.userSearchRepository.findAdminUserObjectWithId(id);
    this.validateLibrary.isExistData(adminObject, "admin object");
    return adminObject;
  }

  async findAdminUserProfileInfoWithId(id: string): Promise<UserEntity> {
    const adminUser =
      await this.userSearchRepository.findAdminUserProfileInfoWithId(id);
    this.validateLibrary.isExistData(adminUser, "admin user");
    return adminUser;
  }

  async findUserProfile(
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<[string, UserEntity]> {
    if (jwtPayload.userRole.toString() === "admin") {
      const adminUser =
        await this.userSearchRepository.findAdminUserProfileInfoWithId(
          jwtPayload.userId,
        );
      this.validateLibrary.isExistData(adminUser, "admin user");
      return ["관리자 사용자의 정보를 가져옵니다.", adminUser];
    } else {
      const clientUser =
        await this.userSearchRepository.findClientUserProfileInfoWithId(
          jwtPayload.userId,
        );
      this.validateLibrary.isExistData(clientUser, "client user");
      return ["고객 사용자의 정보를 가져옵니다.", clientUser];
    }
  }

  async findUserForgotten(realname: string, phonenumber: string) {
    const user = await this.userSearchRepository.findUserForgotten(
      realname,
      phonenumber,
    );
    this.validateLibrary.isExistData(user, "user");
    return user;
  }
}
