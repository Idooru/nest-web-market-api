import { Repository } from "typeorm";
import { UserEntity } from "../../entities/user.entity";
import { AdminUserEntity } from "../../entities/admin-user.entity";
import { ClientUserEntity } from "../../entities/client-user.entity";
import { UserProfileEntity } from "../../entities/user-profile.entity";
import { UserAuthEntity } from "../../entities/user-auth.entity";

export interface UserRepositoryPayload {
  userRepository: Repository<UserEntity>;
  adminUserRepository: Repository<AdminUserEntity>;
  clientUserRepository: Repository<ClientUserEntity>;
  userProfileRepository: Repository<UserProfileEntity>;
  userAuthRepository: Repository<UserAuthEntity>;
}

export class UserRepositoryVO {
  private _userRepository: Repository<UserEntity>;
  private _adminUserRepository: Repository<AdminUserEntity>;
  private _clientUserRepository: Repository<ClientUserEntity>;
  private _userProfileRepository: Repository<UserProfileEntity>;
  private _userAuthRepository: Repository<UserAuthEntity>;

  public setRepositoryPayload(repositoryPayload: UserRepositoryPayload): void {
    const {
      userRepository,
      adminUserRepository,
      clientUserRepository,
      userProfileRepository,
      userAuthRepository,
    } = repositoryPayload;

    this.userRepository = userRepository;
    this.adminUserRepository = adminUserRepository;
    this.clientUserRepository = clientUserRepository;
    this.userProfileRepository = userProfileRepository;
    this.userAuthRepository = userAuthRepository;
  }

  public get userRepository(): Repository<UserEntity> {
    return this._userRepository;
  }

  public set userRepository(value: Repository<UserEntity>) {
    this._userRepository = value;
  }

  public get adminUserRepository(): Repository<AdminUserEntity> {
    return this._adminUserRepository;
  }

  public set adminUserRepository(value: Repository<AdminUserEntity>) {
    this._adminUserRepository = value;
  }

  public get clientUserRepository(): Repository<ClientUserEntity> {
    return this._clientUserRepository;
  }

  public set clientUserRepository(value: Repository<ClientUserEntity>) {
    this._clientUserRepository = value;
  }

  public get userProfileRepository(): Repository<UserProfileEntity> {
    return this._userProfileRepository;
  }

  public set userProfileRepository(value: Repository<UserProfileEntity>) {
    this._userProfileRepository = value;
  }

  public get userAuthRepository(): Repository<UserAuthEntity> {
    return this._userAuthRepository;
  }

  public set userAuthRepository(value: Repository<UserAuthEntity>) {
    this._userAuthRepository = value;
  }
}
