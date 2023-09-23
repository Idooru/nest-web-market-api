import { Injectable } from "@nestjs/common";
import { UserSearchRepository } from "../repositories/user-search.repository";
import { UserEntity } from "../entities/user.entity";
import { ValidateLibrary } from "src/common/lib/util/validate.library";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { ClientUserEntity } from "../entities/client-user.entity";
import { AdminUserEntity } from "../entities/admin-user.entity";

@Injectable()
export class UserSearcher {
  constructor(private readonly userSearchRepository: UserSearchRepository) {}

  async findUserWithId(id: string): Promise<UserEntity> {
    return await this.userSearchRepository.findUserWithId(id);
  }

  async findUserWithEmail(email: string): Promise<UserEntity> {
    return await this.userSearchRepository.findUserWithEmail(email);
  }

  async findUserWithNickname(nickname: string): Promise<UserEntity> {
    return await this.userSearchRepository.findUserWithNickname(nickname);
  }

  async findClientUserWithId(id: string): Promise<UserEntity> {
    return await this.userSearchRepository.findClientUserWithId(id);
  }

  async findAdminUserWithId(id: string): Promise<UserEntity> {
    return await this.userSearchRepository.findAdminUserWithId(id);
  }

  async findAllUsersFromLatest(): Promise<UserEntity[]> {
    return await this.userSearchRepository.findAllUsersFromLatest();
  }

  async findAllUsersFromOldest(): Promise<UserEntity[]> {
    return await this.userSearchRepository.findAllUsersFromOldest();
  }

  async findClientUserInfo(id: string): Promise<UserEntity> {
    return await this.userSearchRepository.findClientUserInfo(id);
  }

  async findClientUserObjectWithId(id: string): Promise<ClientUserEntity> {
    return await this.userSearchRepository.findClientUserObjectWithId(id);
  }

  async findAdminUserObjectWithId(id: string): Promise<AdminUserEntity> {
    return await this.userSearchRepository.findAdminUserObjectWithId(id);
  }

  async findAdminUserProfileInfoWithId(id: string): Promise<UserEntity> {
    return await this.userSearchRepository.findAdminUserProfileInfoWithId(id);
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

  async findUserForgotten(realname: string, phonenumber: string) {
    return await this.userSearchRepository.findUserForgotten(
      realname,
      phonenumber,
    );
  }
}
