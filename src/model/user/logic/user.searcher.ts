import { BadRequestException, Injectable } from "@nestjs/common";
import { UserSearchRepository } from "../repositories/user-search.repository";
import { UserEntity } from "../entities/user.entity";
import { JwtAccessTokenPayload } from "src/model/auth/jwt/jwt-access-token-payload.interface";
import { ClientUserEntity } from "../entities/client-user.entity";
import { AdminUserEntity } from "../entities/admin-user.entity";
import { FindEmailDto } from "../dtos/find-email.dto";
import { loggerFactory } from "../../../common/functions/logger.factory";

@Injectable()
export class UserSearcher {
  constructor(private readonly repository: UserSearchRepository) {}

  public findUserWithId(id: string): Promise<UserEntity> {
    return this.repository.findUserWithId(id);
  }

  public findUserWithEmail(email: string): Promise<UserEntity> {
    return this.repository.findUserWithEmail(email);
  }

  public findAllUsersFromLatest(): Promise<UserEntity[]> {
    return this.repository.findAllUsers("user.createdAt", "DESC");
  }

  public findAllUsersFromOldest(): Promise<UserEntity[]> {
    return this.repository.findAllUsers("user.createdAt", "ASC");
  }

  public findClientUserInfo(id: string): Promise<UserEntity> {
    return this.repository.findClientUserInfo(id);
  }

  public async findClientUserObjectWithId(id: string): Promise<ClientUserEntity> {
    const user = await this.repository.findClientUserWithId(id);
    return this.repository.findClientUserObjectWithId(user);
  }

  public async findAdminUserObjectWithId(id: string): Promise<AdminUserEntity> {
    const user = await this.repository.findAdminUserWithId(id);
    return this.repository.findAdminUserObjectWithId(user);
  }

  public findUserProfile(jwtPayload: JwtAccessTokenPayload): Promise<UserEntity> {
    return this.repository.findUserProfile(jwtPayload.userId);
  }

  public async findForgottenEmail(dto: FindEmailDto): Promise<UserEntity> {
    const { realName, phoneNumber } = dto;
    const [found1, found2] = await Promise.all([
      this.repository.findUserWithRealName(realName),
      this.repository.findUserWithPhoneNumber(phoneNumber),
    ]);

    if (found1.id !== found2.id) {
      const message = "입력한 실명과 전화번호가 일치하지 않는 사용자입니다.";
      loggerFactory("None Correct User").error(message);
      throw new BadRequestException(message);
    }

    return found1;
  }
}
