import { Repository } from "typeorm";
import { UserEntity } from "../../entities/user.entity";
import { AdminUserEntity } from "../../entities/admin-user.entity";
import { ClientUserEntity } from "../../entities/client-user.entity";
import { UserProfileEntity } from "../../entities/user-profile.entity";
import { UserAuthEntity } from "../../entities/user-auth.entity";

export interface UserRepositoryPayload {
  user: Repository<UserEntity>;
  adminUser: Repository<AdminUserEntity>;
  clientUser: Repository<ClientUserEntity>;
  userProfile: Repository<UserProfileEntity>;
  userAuth: Repository<UserAuthEntity>;
}
