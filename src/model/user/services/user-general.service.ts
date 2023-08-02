import { ModifyUserDto } from "../dtos/modify-user.dto";
import { Injectable } from "@nestjs/common";
import { UserGeneralRepository } from "../repositories/user-general.repository";
import { SecurityLibrary } from "src/common/lib/config/security.library";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { UserEntity } from "../entities/user.entity";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { LibraryErrorHandlingBuilder } from "src/common/lib/error-handler/library-error-handling.builder";
import { IUserGeneralService } from "../interfaces/services/user-general-service.intreface";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserGeneralService
  extends ErrorHandlerProps
  implements IUserGeneralService
{
  constructor(
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly securityLibrary: SecurityLibrary,
    private readonly libraryErrorHandlerBuilder: LibraryErrorHandlingBuilder,
  ) {
    super();
  }

  async findAllUsersFromLatest(): Promise<UserEntity[]> {
    return await this.userGeneralRepository.findAllUsersFromLatest();
  }

  async findAllUsersFromOldest(): Promise<UserEntity[]> {
    return await this.userGeneralRepository.findAllUsersFromOldest();
  }

  async findClientUserInfo(id: string): Promise<UserEntity> {
    return await this.userGeneralRepository.findClientUserInfo(id);
  }

  async findClientUserProfileInfoWithId(id: string): Promise<UserEntity> {
    return await this.userGeneralRepository.findClientUserProfileInfoWithId(id);
  }

  async findAdminUserProfileInfoWithId(id: string): Promise<UserEntity> {
    return await this.userGeneralRepository.findAdminUserProfileInfoWithId(id);
  }

  async createUserEntity(role: ["client", "admin"]): Promise<UserEntity> {
    const user = await this.userGeneralRepository.createUserEntity(role);

    if (role.toString() === "admin") {
      await this.createAdminUser(user);
    } else {
      await this.createClientUser(user);
    }

    return user;
  }

  async createClientUser(user: UserEntity): Promise<void> {
    await this.userGeneralRepository.createClientUser(user);
  }

  async createAdminUser(user: UserEntity): Promise<void> {
    await this.userGeneralRepository.createAdminUser(user);
  }

  async createUserBase(
    user: UserEntity,
    registerUserDto: RegisterUserDto,
  ): Promise<{ email: string; nickname: string }> {
    const { id } = user;
    const { realname, nickname, birth, gender, email, phonenumber, password } =
      registerUserDto;
    let hashed: string;

    try {
      hashed = await bcrypt.hash(password, this.securityLibrary.getHashSalt());
    } catch (err) {
      this.methodName = this.createUserBase.name;
      this.libraryErrorHandlerBuilder
        .setError(err)
        .setLibraryName("bcrypt")
        .setSourceNames(this.className, this.methodName)
        .handle();
    }

    const userProfileColumn = { id, realname, birth, gender, phonenumber };
    const userAuthColumn = { id, nickname, email, password: hashed };

    await Promise.all([
      this.userGeneralRepository.createUserProfile(userProfileColumn),
      this.userGeneralRepository.createUserAuth(userAuthColumn),
    ]);

    return {
      email,
      nickname,
    };
  }

  async modifyUser(
    modifyUserDto: ModifyUserDto,
    userId: string,
  ): Promise<void> {
    const { password, phonenumber, email, nickname } = modifyUserDto;
    let hashed: string;

    try {
      hashed = await bcrypt.hash(password, this.securityLibrary.getHashSalt());
    } catch (err) {
      this.methodName = this.modifyUser.name;
      this.libraryErrorHandlerBuilder
        .setError(err)
        .setLibraryName("bcrypt")
        .setSourceNames(this.className, this.methodName)
        .handle();
    }

    const user = await this.userGeneralRepository.findUserWithId(userId);

    await Promise.all([
      this.userGeneralRepository.modifyUserProfile(
        { phonenumber },
        user.Profile.id,
      ),
      this.userGeneralRepository.modifyUserAuth(
        { email, nickname, password: hashed },
        user.Auth.id,
      ),
    ]);
  }

  async modifyUserEmail(email: string, userId: string): Promise<void> {
    const user = await this.userGeneralRepository.findUserWithId(userId);

    await this.userGeneralRepository.modifyUserEmail(email, user.Auth.id);
  }

  async modifyUserNickName(nickname: string, userId: string): Promise<void> {
    const user = await this.userGeneralRepository.findUserWithId(userId);

    await this.userGeneralRepository.modifyUserNickName(nickname, user.Auth.id);
  }

  async modifyUserPhoneNumber(
    phonenumber: string,
    userId: string,
  ): Promise<void> {
    const user = await this.userGeneralRepository.findUserWithId(userId);

    await this.userGeneralRepository.modifyUserPhoneNumber(
      phonenumber,
      user.Profile.id,
    );
  }

  async modifyUserPassword(password: string, userId: string): Promise<void> {
    let hashed: string;

    try {
      hashed = await bcrypt.hash(password, this.securityLibrary.getHashSalt());
    } catch (err) {
      this.methodName = this.modifyUserPassword.name;
      this.libraryErrorHandlerBuilder
        .setError(err)
        .setLibraryName("bcrypt")
        .setSourceNames(this.className, this.methodName)
        .handle();
    }

    const user = await this.userGeneralRepository.findUserWithId(userId);

    await this.userGeneralRepository.modifyUserPassword(hashed, user.Auth.id);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userGeneralRepository.deleteUser(userId);
  }
}
