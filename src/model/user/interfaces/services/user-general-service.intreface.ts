import { ModifyUserDto } from "../../dtos/modify-user.dto";
import { RegisterUserDto } from "../../dtos/register-user.dto";
import { UserEntity } from "../../entities/user.entity";

export interface IUserGeneralService {
  findAllUsersFromLatest(): Promise<UserEntity[]>;
  findAllUsersFromOldest(): Promise<UserEntity[]>;
  findClientUserInfo(id: string): Promise<UserEntity>;
  findClientUserProfileInfoWithId(id: string): Promise<UserEntity>;
  findAdminUserProfileInfoWithId(id: string): Promise<UserEntity>;
  createUserBase(registerUserDto: RegisterUserDto): Promise<UserEntity>;
  createClientOrAdmin(
    registerUserDto: RegisterUserDto,
    userBase: UserEntity,
  ): Promise<void>;
  modifyUser(modifyUserDto: ModifyUserDto, userId: string): Promise<void>;
  modifyUserEmail(email: string, userId: string): Promise<void>;
  modifyUserNickName(nickname: string, userId: string): Promise<void>;
  modifyUserPhoneNumber(phonenumber: string, userId: string): Promise<void>;
  modifyUserPassword(password: string, userId: string): Promise<void>;
  deleteUser(userId: string): Promise<void>;
}
