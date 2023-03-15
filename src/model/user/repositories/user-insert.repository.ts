import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryLogger } from "src/common/classes/repository.logger";
import { Repository } from "typeorm";
import { AdminUserEntity } from "../entities/admin-user.entity";
import { ClientUserEntity } from "../entities/client-user.entity";
import { UserAuthEntity } from "../entities/user.auth.entity";
import { UserEntity } from "../entities/user.entity";
import { UserProfileEntity } from "../entities/user.profile.entity";

@Injectable()
export class UserInsertRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthRepository: Repository<UserAuthEntity>,
    @InjectRepository(ClientUserEntity)
    private readonly clientUserRepository: Repository<ClientUserEntity>,
    @InjectRepository(AdminUserEntity)
    private readonly adminUserRepository: Repository<AdminUserEntity>,
  ) {
    super("User Insert");
  }

  async findLastCreatedUserProfile(): Promise<UserProfileEntity> {
    try {
      return await this.userProfileRepository
        .createQueryBuilder()
        .select("profile")
        .from(UserProfileEntity, "profile")
        .orderBy("profile.createdAt", "DESC")
        .limit(1)
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findLastCreatedUserAuth(): Promise<UserAuthEntity> {
    try {
      return await this.userAuthRepository
        .createQueryBuilder()
        .select("auth")
        .from(UserAuthEntity, "auth")
        .orderBy("auth.createdAt", "DESC")
        .limit(1)
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findLastCreatedUserBase(): Promise<UserEntity> {
    try {
      return await this.userRepository
        .createQueryBuilder()
        .select("userBase")
        .from(UserEntity, "userBase")
        .orderBy("userBase.createdAt", "DESC")
        .limit(1)
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findLastCreatedClientUser(): Promise<ClientUserEntity> {
    try {
      return await this.clientUserRepository
        .createQueryBuilder()
        .select("clientUser")
        .from(ClientUserEntity, "clientUser")
        .orderBy("clientUser.createdAt", "DESC")
        .limit(1)
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findLastCreatedAdminUser(): Promise<AdminUserEntity> {
    try {
      return await this.adminUserRepository
        .createQueryBuilder()
        .select("adminUser")
        .from(AdminUserEntity, "adminUser")
        .orderBy("adminUser.createdAt", "DESC")
        .limit(1)
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertUserBaseIdOnUserProfile(
    userBase: UserEntity,
    userProfile: UserProfileEntity,
  ): Promise<void> {
    try {
      await this.userProfileRepository
        .createQueryBuilder()
        .update(UserProfileEntity)
        .set({ User: userBase })
        .where("id = :id", { id: userProfile.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertUserBaseIdOnUserAuth(
    userBase: UserEntity,
    userAuth: UserAuthEntity,
  ): Promise<void> {
    try {
      await this.userAuthRepository
        .createQueryBuilder()
        .update(UserAuthEntity)
        .set({ User: userBase })
        .where("id = :id", { id: userAuth.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertUserBaseIdOnClientUser(
    userBase: UserEntity,
    clientUser: ClientUserEntity,
  ): Promise<void> {
    try {
      await this.clientUserRepository
        .createQueryBuilder()
        .update(ClientUserEntity)
        .set({ User: userBase })
        .where("id = :id", { id: clientUser.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertUserBaseIdOnAdminUser(
    userBase: UserEntity,
    adminUser: AdminUserEntity,
  ): Promise<void> {
    try {
      await this.adminUserRepository
        .createQueryBuilder()
        .update(AdminUserEntity)
        .set({ User: userBase })
        .where("id = :id", { id: adminUser.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
