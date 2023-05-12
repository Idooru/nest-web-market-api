import { InsertResult } from "typeorm";
import { CreateUserBaseDto } from "../../dtos/create-user-base.dto";
import {
  RegisterUserAuthDto,
  RegisterUserProfileDto,
} from "../../dtos/register-user.dto";
import { AdminUserEntity } from "../../entities/admin-user.entity";
import { ClientUserEntity } from "../../entities/client-user.entity";
import { UserAuthEntity } from "../../entities/user.auth.entity";
import { UserEntity } from "../../entities/user.entity";
import { UserProfileEntity } from "../../entities/user.profile.entity";
import {
  ModifyUserAuthDto,
  ModifyUserProfileDto,
} from "../../dtos/modify-user.dto";

export interface IUserGeneralRepository {
  findAllUsersFromLatest(): Promise<UserEntity[]>;
  findAllUsersFromOldest(): Promise<UserEntity[]>;
  findUserWithId(id: string): Promise<UserEntity>;
  findClientUserWithId(id: string): Promise<UserEntity>;
  findAdminUserWithId(id: string): Promise<UserEntity>;
  findClientUserObjectWithId(id: string): Promise<ClientUserEntity>;
  findAdminUserObjectWithId(id: string): Promise<AdminUserEntity>;
  findUserWithEmail(email: string): Promise<UserEntity>;
  findUserWithNickName(nickname: string): Promise<UserEntity>;
  findUserWithRealName(realname: string): Promise<UserEntity | null>;
  findUserWithPhoneNumber(phonenumber: string): Promise<UserEntity | null>;
  findClientUserProfileInfoWithId(id: string): Promise<UserEntity>;
  findAdminUserProfileInfoWithId(id: string): Promise<UserEntity>;
  findClientUserInfoFromAdminWithId(id: string): Promise<UserEntity>;
  resetPassword(id: string, hashed: string): Promise<void>;
  createUserProfile(
    registerUserProfileDto: RegisterUserProfileDto,
  ): Promise<UserProfileEntity>;
  createUserAuth(
    registerUserAuthDto: RegisterUserAuthDto,
  ): Promise<UserAuthEntity>;
  findUserProfile(
    userProfileDummy: UserProfileEntity,
  ): Promise<UserProfileEntity>;
  findUserAuth(userAuthDummy: UserAuthEntity): Promise<UserAuthEntity>;
  createUserBase(createUserBaseDto: CreateUserBaseDto): Promise<InsertResult>;
  createClientUser(user: UserEntity): Promise<InsertResult>;
  createAdminUser(user: UserEntity): Promise<InsertResult>;
  modifyUserProfile(
    modifyUserProfileDto: ModifyUserProfileDto,
    id: string,
  ): Promise<void>;
  modifyUserAuth(
    modifyUserAuthDto: ModifyUserAuthDto,
    id: string,
  ): Promise<void>;
  modifyUserEmail(email: string, id: string): Promise<void>;
  modifyUserNickName(nickname: string, id: string): Promise<void>;
  modifyUserPhoneNumber(phonenumber: string, id: string): Promise<void>;
  modifyUserPassword(password: string, id: string): Promise<void>;
  deleteUser(id: string): Promise<void>;
}
