import { ModifyUserDto } from "../dtos/modify-user.dto";
import { Injectable } from "@nestjs/common";
import { UserGeneralRepository } from "../repositories/user-general.repository";
import { SecurityLibrary } from "src/common/lib/config/security.library";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { UserEntity } from "../entities/user.entity";
import { UserInsertRepository } from "../repositories/user-insert.repository";
import { CreateUserBaseDto } from "../dtos/create-user-base.dto";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { LibraryErrorHandlerBuilder } from "src/common/lib/error-handler/library-error-handler.builder";

import * as bcrypt from "bcrypt";
import { IUserGeneralService } from "../interfaces/services/user-general-service.intreface";

@Injectable()
export class UserGeneralService
  extends ErrorHandlerProps
  implements IUserGeneralService
{
  constructor(
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly userInsertRepository: UserInsertRepository,
    private readonly securityLibrary: SecurityLibrary,
    private readonly libraryErrorHandlerBuilder: LibraryErrorHandlerBuilder,
  ) {
    super();
  }

  async findAllUsersFromLatest(): Promise<UserEntity[]> {
    return await this.userGeneralRepository.findAllUsersFromLatest();
  }

  async findAllUsersFromOldest(): Promise<UserEntity[]> {
    return await this.userGeneralRepository.findAllUsersFromOldest();
  }

  async findClientUserInfoFromAdminWithId(id: string): Promise<UserEntity> {
    return await this.userGeneralRepository.findClientUserInfoFromAdminWithId(
      id,
    );
  }

  async findClientUserProfileInfoWithId(id: string): Promise<UserEntity> {
    return await this.userGeneralRepository.findClientUserProfileInfoWithId(id);
  }

  async findAdminUserProfileInfoWithId(id: string): Promise<UserEntity> {
    return await this.userGeneralRepository.findAdminUserProfileInfoWithId(id);
  }

  async createUserBase(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const {
      realname,
      nickname,
      birth,
      gender,
      email,
      phonenumber,
      type,
      password,
    } = registerUserDto;
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

    const userProfileColumn = { realname, birth, gender, phonenumber };
    const userAuthColumn = { nickname, email, password: hashed };

    const [userProfileDummy, userAuthDummy] = await Promise.all([
      this.userGeneralRepository.createUserProfile(userProfileColumn),
      this.userGeneralRepository.createUserAuth(userAuthColumn),
    ]);

    const [userProfile, userAuth] = await Promise.all([
      this.userGeneralRepository.findUserProfile(userProfileDummy),
      this.userGeneralRepository.findUserAuth(userAuthDummy),
    ]);

    const createUserBaseDto: CreateUserBaseDto = {
      Profile: userProfile,
      Auth: userAuth,
      type,
    };

    const userBaseOutput = await this.userGeneralRepository.createUserBase(
      createUserBaseDto,
    );

    const userBaseId: string = userBaseOutput.generatedMaps[0].id;

    const userBase = await this.userInsertRepository.findOneUserBaseById(
      userBaseId,
    );

    await Promise.all([
      this.userInsertRepository.insertUserBaseIdOnUserProfile(
        userBase,
        userProfile,
      ),
      this.userInsertRepository.insertUserBaseIdOnUserAuth(userBase, userAuth),
    ]);

    return userBase;
  }

  async createClientOrAdmin(
    registerUserDto: RegisterUserDto,
    userBase: UserEntity,
  ): Promise<void> {
    if (registerUserDto.type.toString() === "client") {
      const clientUserOutput =
        await this.userGeneralRepository.createClientUser(userBase);

      const clientUserId: string = clientUserOutput.generatedMaps[0].id;

      const clientUser = await this.userInsertRepository.findOneClientUserById(
        clientUserId,
      );

      await this.userInsertRepository.insertUserBaseIdOnClientUser(
        userBase,
        clientUser,
      );
    } else {
      const adminUserOutput = await this.userGeneralRepository.createAdminUser(
        userBase,
      );

      const adminUserId: string = adminUserOutput.generatedMaps[0].id;

      const adminUser = await this.userInsertRepository.findOneAdminUserById(
        adminUserId,
      );

      await this.userInsertRepository.insertUserBaseIdOnAdminUser(
        userBase,
        adminUser,
      );
    }
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
      this.methodName = this.createUserBase.name;
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
      this.methodName = this.createUserBase.name;
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
