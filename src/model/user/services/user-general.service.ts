import { PatchUserDto } from "../dtos/patch-user.dto";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";
import { UserGeneralRepository } from "../repositories/user-general.repository";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserGeneralService {
  constructor(private readonly userGeneralRepository: UserGeneralRepository) {}

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const { password } = registerUserDto;

    const hashed = await bcrypt.hash(password, 10);
    await this.userGeneralRepository.createUser(registerUserDto, hashed);
  }

  async findSelfInfoWithId(userId: string): Promise<UserEntity> {
    return await this.userGeneralRepository.findUserProfileInfoWithId(userId);
  }

  async patchUserInfoMyself(
    patchUserDto: PatchUserDto,
    userId: string,
  ): Promise<void> {
    const user = await this.userGeneralRepository.findUserWithId(userId);

    const { password } = patchUserDto;
    const hashed = await bcrypt.hash(password, 10);

    await this.userGeneralRepository.patchUser(
      patchUserDto,
      hashed,
      user.Profile.id,
      user.Auth.id,
    );
  }

  async deleteUserWithId(userId: string): Promise<void> {
    await this.userGeneralRepository.deleteUser(userId);
  }

  async getUsersAllFromLastest(): Promise<UserEntity[]> {
    return await this.userGeneralRepository.findUsersAllFromLastest();
  }

  async getUsersAllFromOldest(): Promise<UserEntity[]> {
    return await this.userGeneralRepository.findUsersAllFromOldest();
  }

  async getUserById(userId: string): Promise<UserEntity> {
    return await this.userGeneralRepository.findUserProfileInfoWithId(userId);
  }
}
