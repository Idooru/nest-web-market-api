import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { AdminUserEntity } from "../entities/admin-user.entity";
import { ClientUserEntity } from "../entities/client-user.entity";
import { UserProfileEntity } from "../entities/user-profile.entity";
import { UserAuthEntity } from "../entities/user-auth.entity";

export interface RepositoryPayload {
  userRepository: Repository<UserEntity>;
  adminUserRepository: Repository<AdminUserEntity>;
  clientUserRepository: Repository<ClientUserEntity>;
  userProfileRepository: Repository<UserProfileEntity>;
  userAuthRepository: Repository<UserAuthEntity>;
}
