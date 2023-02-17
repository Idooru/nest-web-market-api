import { ModifyUserDto } from "../dtos/modify-user.dto";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";
import { UserGeneralRepository } from "../repositories/user-general.repository";
import { SecurityLibrary } from "src/common/lib/security.library";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserGeneralService {
  constructor(
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly securityLibrary: SecurityLibrary,
  ) {}

  async getUsersAllFromLastest(): Promise<UserEntity[]> {
    return await this.userGeneralRepository.findUsersAllFromLastest();
  }

  async getUsersAllFromOldest(): Promise<UserEntity[]> {
    return await this.userGeneralRepository.findUsersAllFromOldest();
  }

  async getUserById(userId: string): Promise<UserEntity> {
    return await this.userGeneralRepository.findUserProfileInfoWithId(userId);
  }

  async findSelfInfoWithId(userId: string): Promise<UserEntity> {
    return await this.userGeneralRepository.findUserProfileInfoWithId(userId);
  }

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const { password } = registerUserDto;

    const hashed = await bcrypt.hash(
      password,
      this.securityLibrary.getHashSalt(),
    );

    await this.userGeneralRepository.createUser(registerUserDto, hashed);
  }

  async modifyUser(
    modifyUserDto: ModifyUserDto,
    userId: string,
  ): Promise<void> {
    const user = await this.userGeneralRepository.findUserWithId(userId);

    const { password } = modifyUserDto;
    const hashed = await bcrypt.hash(
      password,
      this.securityLibrary.getHashSalt(),
    );

    await this.userGeneralRepository.modifyUser(
      modifyUserDto,
      hashed,
      user.Profile.id,
      user.Auth.id,
    );
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
    const user = await this.userGeneralRepository.findUserWithId(userId);

    const hashed = await bcrypt.hash(
      password,
      this.securityLibrary.getHashSalt(),
    );

    await this.userGeneralRepository.modifyUserPassword(hashed, user.Auth.id);
  }

  async deleteUserWithId(userId: string): Promise<void> {
    await this.userGeneralRepository.deleteUser(userId);
  }
}
