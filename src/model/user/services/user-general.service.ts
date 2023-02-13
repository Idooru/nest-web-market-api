import { Injectable } from "@nestjs/common";
import { UserGeneralRepository } from "../repositories/user-general.repository";
import { UserEntity } from "../entities/user.entity";
import { UserExistService } from "./user-exist.service";

import * as bcrypt from "bcrypt";
import { PatchUserDto } from "../dtos/patch-user.dto";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { SecurityLibrary } from "src/common/lib/security.library";

@Injectable()
export class UserGeneralService {
  constructor(
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly userExistService: UserExistService,
    private readonly securityLibrary: SecurityLibrary,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const { password } = registerUserDto;

    const hashed = await bcrypt.hash(
      password,
      Number(this.securityLibrary.getHashSalt()),
    );
    return await this.userGeneralRepository.createUser(registerUserDto, hashed);
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
    const hashed = await bcrypt.hash(
      password,
      Number(this.securityLibrary.getHashSalt()),
    );

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
