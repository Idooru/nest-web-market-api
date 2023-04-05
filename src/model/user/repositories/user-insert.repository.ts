import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryErrorHandleLibrary } from "src/common/lib/error-handler/repository-error-handler.library";
import { Repository } from "typeorm";
import { AdminUserEntity } from "../entities/admin-user.entity";
import { ClientUserEntity } from "../entities/client-user.entity";
import { UserAuthEntity } from "../entities/user.auth.entity";
import { UserEntity } from "../entities/user.entity";
import { UserProfileEntity } from "../entities/user.profile.entity";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";

@Injectable()
export class UserInsertRepository extends ErrorHandlerProps {
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
    private readonly repositoryErrorHandler: RepositoryErrorHandleLibrary,
  ) {
    super();
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
      this.methodName = this.findLastCreatedUserProfile.name;
      this.repositoryErrorHandler.init<UserProfileEntity>(
        new UserProfileEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.methodName = this.findLastCreatedUserAuth.name;
      this.repositoryErrorHandler.init<UserAuthEntity>(
        new UserAuthEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.methodName = this.findLastCreatedUserBase.name;
      this.repositoryErrorHandler.init<UserEntity>(
        new UserEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.methodName = this.findLastCreatedClientUser.name;
      this.repositoryErrorHandler.init<ClientUserEntity>(
        new ClientUserEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.methodName = this.findLastCreatedAdminUser.name;
      this.repositoryErrorHandler.init<AdminUserEntity>(
        new AdminUserEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.methodName = this.insertUserBaseIdOnUserProfile.name;
      this.repositoryErrorHandler.init<UserProfileEntity>(
        new UserProfileEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.methodName = this.insertUserBaseIdOnUserAuth.name;
      this.repositoryErrorHandler.init<UserAuthEntity>(
        new UserAuthEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.methodName = this.insertUserBaseIdOnClientUser.name;
      this.repositoryErrorHandler.init<ClientUserEntity>(
        new ClientUserEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.methodName = this.insertUserBaseIdOnAdminUser.name;
      this.repositoryErrorHandler.init<AdminUserEntity>(
        new AdminUserEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }
}
