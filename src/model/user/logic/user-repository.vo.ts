import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { AdminUserEntity } from "../entities/admin-user.entity";
import { ClientUserEntity } from "../entities/client-user.entity";
import { UserProfileEntity } from "../entities/user-profile.entity";
import { UserAuthEntity } from "../entities/user-auth.entity";

export interface UserRepositoryPayload {
  userRepository: Repository<UserEntity>;
  adminUserRepository: Repository<AdminUserEntity>;
  clientUserRepository: Repository<ClientUserEntity>;
  userProfileRepository: Repository<UserProfileEntity>;
  userAuthRepository: Repository<UserAuthEntity>;
}

export class UserRepositoryVO {
  private userRepository: Repository<UserEntity>;
  private adminUserRepository: Repository<AdminUserEntity>;
  private clientUserRepository: Repository<ClientUserEntity>;
  private userProfileRepository: Repository<UserProfileEntity>;
  private userAuthRepository: Repository<UserAuthEntity>;

  public setRepositoryPayload(repositoryPayload: UserRepositoryPayload): void {
    const {
      userRepository,
      adminUserRepository,
      clientUserRepository,
      userProfileRepository,
      userAuthRepository,
    } = repositoryPayload;

    this.setUserRepository(userRepository);
    this.setAdminUserRepository(adminUserRepository);
    this.setClientUserRepository(clientUserRepository);
    this.setUserProfileRepository(userProfileRepository);
    this.setUserAuthRepository(userAuthRepository);
  }

  public getUserRepository(): Repository<UserEntity> {
    return this.userRepository;
  }

  public setUserRepository(userRepository: Repository<UserEntity>): void {
    this.userRepository = userRepository;
  }

  public getAdminUserRepository(): Repository<AdminUserEntity> {
    return this.adminUserRepository;
  }

  public setAdminUserRepository(
    adminUserRepository: Repository<AdminUserEntity>,
  ): void {
    this.adminUserRepository = adminUserRepository;
  }

  public getClientUserRepository(): Repository<ClientUserEntity> {
    return this.clientUserRepository;
  }

  public setClientUserRepository(
    clientUserRepository: Repository<ClientUserEntity>,
  ): void {
    this.clientUserRepository = clientUserRepository;
  }

  public getUserProfileRepository(): Repository<UserProfileEntity> {
    return this.userProfileRepository;
  }

  public setUserProfileRepository(
    userProfileRepository: Repository<UserProfileEntity>,
  ): void {
    this.userProfileRepository = userProfileRepository;
  }

  public getUserAuthRepository(): Repository<UserAuthEntity> {
    return this.userAuthRepository;
  }

  public setUserAuthRepository(
    userAuthRepository: Repository<UserAuthEntity>,
  ): void {
    this.userAuthRepository = userAuthRepository;
  }
}
