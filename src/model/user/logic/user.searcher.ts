import { Injectable } from "@nestjs/common";
import { UserSearchRepository } from "../repositories/user-search.repository";
import { UserEntity } from "../entities/user.entity";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { ClientUserEntity } from "../entities/client-user.entity";
import { AdminUserEntity } from "../entities/admin-user.entity";
import { FindEmailDto } from "../dtos/find-email.dto";

@Injectable()
export class UserSearcher {
  constructor(private readonly userSearchRepository: UserSearchRepository) {}

  public findUserWithId(id: string): Promise<UserEntity> {
    return this.userSearchRepository.findUserWithId(id);
  }

  public findUserWithEmail(email: string): Promise<UserEntity> {
    return this.userSearchRepository.findUserWithEmail(email);
  }

  public findAllUsersFromLatest(): Promise<UserEntity[]> {
    return this.userSearchRepository.findAllUsersFromLatest();
  }

  public findAllUsersFromOldest(): Promise<UserEntity[]> {
    return this.userSearchRepository.findAllUsersFromOldest();
  }

  public findClientUserInfo(id: string): Promise<UserEntity> {
    return this.userSearchRepository.findClientUserInfo(id);
  }

  public async findClientUserObjectWithId(id: string): Promise<ClientUserEntity> {
    const user = await this.userSearchRepository.findClientUserWithId(id);
    return this.userSearchRepository.findClientUserObjectWithId(user);
  }

  public async findAdminUserObjectWithId(id: string): Promise<AdminUserEntity> {
    const user = await this.userSearchRepository.findAdminUserWithId(id);
    return this.userSearchRepository.findAdminUserObjectWithId(user);
  }

  public findUserProfile(jwtPayload: JwtAccessTokenPayload): Promise<UserEntity> {
    return this.userSearchRepository.findUserProfile(jwtPayload.userId);
  }

  public findUserForgotten(dto: FindEmailDto): Promise<UserEntity> {
    return this.userSearchRepository.findUserForgotten(dto);
  }
}
