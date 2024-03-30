import { Injectable } from "@nestjs/common";
import { UserSearchRepository } from "../repositories/user-search.repository";
import { UserEntity } from "../entities/user.entity";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { ClientUserEntity } from "../entities/client-user.entity";
import { AdminUserEntity } from "../entities/admin-user.entity";

@Injectable()
export class UserSearcher {
  constructor(private readonly userSearchRepository: UserSearchRepository) {}

  findUserWithId(id: string): Promise<UserEntity> {
    return this.userSearchRepository.findUserWithId(id);
  }

  findUserWithEmail(email: string): Promise<UserEntity> {
    return this.userSearchRepository.findUserWithEmail(email);
  }

  findAllUsersFromLatest(): Promise<UserEntity[]> {
    return this.userSearchRepository.findAllUsersFromLatest();
  }

  findAllUsersFromOldest(): Promise<UserEntity[]> {
    return this.userSearchRepository.findAllUsersFromOldest();
  }

  findClientUserInfo(id: string): Promise<UserEntity> {
    return this.userSearchRepository.findClientUserInfo(id);
  }

  findClientUserObjectWithId(id: string): Promise<ClientUserEntity> {
    return this.userSearchRepository.findClientUserObjectWithId(id);
  }

  findAdminUserObjectWithId(id: string): Promise<AdminUserEntity> {
    return this.userSearchRepository.findAdminUserObjectWithId(id);
  }

  async findUserProfile(
    jwtPayload: JwtAccessTokenPayload,
  ): Promise<[string, UserEntity]> {
    if (jwtPayload.userRole.toString() === "admin") {
      const adminUser =
        await this.userSearchRepository.findAdminUserProfileInfoWithId(
          jwtPayload.userId,
        );
      return ["관리자 사용자의 정보를 가져옵니다.", adminUser];
    } else {
      const clientUser =
        await this.userSearchRepository.findClientUserProfileInfoWithId(
          jwtPayload.userId,
        );
      return ["고객 사용자의 정보를 가져옵니다.", clientUser];
    }
  }

  findUserForgotten(
    realname: string,
    phonenumber: string,
  ): Promise<UserEntity> {
    return this.userSearchRepository.findUserForgotten(realname, phonenumber);
  }
}
