import { AdminUserEntity } from "../../entities/admin-user.entity";
import { ClientUserEntity } from "../../entities/client-user.entity";
import { UserAuthEntity } from "../../entities/user.auth.entity";
import { UserEntity } from "../../entities/user.entity";
import { UserProfileEntity } from "../../entities/user.profile.entity";

export interface IUserInsertRepository {
  findOneUserBaseById(id: string): Promise<UserEntity>;
  findOneClientUserById(id: string): Promise<ClientUserEntity>;
  findOneAdminUserById(id: string): Promise<AdminUserEntity>;
  insertUserBaseIdOnUserProfile(
    userBase: UserEntity,
    userProfile: UserProfileEntity,
  ): Promise<void>;
  insertUserBaseIdOnUserAuth(
    userBase: UserEntity,
    userAuth: UserAuthEntity,
  ): Promise<void>;
  insertUserBaseIdOnClientUser(
    userBase: UserEntity,
    clientUser: ClientUserEntity,
  ): Promise<void>;
  insertUserBaseIdOnAdminUser(
    userBase: UserEntity,
    adminUser: AdminUserEntity,
  ): Promise<void>;
}
