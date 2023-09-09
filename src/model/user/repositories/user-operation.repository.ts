import { Injectable } from "@nestjs/common";
import { UserRepositoryVO } from "../logic/user-repository.vo";
import { UserEntity } from "../entities/user.entity";
import {
  CreateUserAuthDto,
  CreateUserProfileDto,
} from "../dtos/register-user.dto";
import {
  ModifyUserAuthDto,
  ModifyUserProfileDto,
} from "../dtos/modify-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserOperationRepository {
  constructor(
    private readonly queryRunner: UserRepositoryVO,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Transaction
  async createUserEntity(role: ["client", "admin"]): Promise<UserEntity> {
    return await this.queryRunner.getUserRepository().save({ role });
  }

  // Transaction
  async createClientUser(user: UserEntity): Promise<void> {
    await this.queryRunner.getClientUserRepository().save({ User: user });
  }

  // Transaction
  async createAdminUser(user: UserEntity): Promise<void> {
    await this.queryRunner.getAdminUserRepository().save({ User: user });
  }

  // Transaction
  async createUserProfile(
    createUserProfileDto: CreateUserProfileDto,
  ): Promise<void> {
    await this.queryRunner
      .getUserProfileRepository()
      .save({ ...createUserProfileDto });
  }

  // Transaction
  async createUserAuth(createUserAuthDto: CreateUserAuthDto): Promise<void> {
    await this.queryRunner
      .getUserAuthRepository()
      .save({ ...createUserAuthDto });
  }

  // Transaction
  async modifyUserProfile(
    modifyUserProfileDto: ModifyUserProfileDto,
    user: UserEntity,
  ): Promise<void> {
    user.Profile.phonenumber = modifyUserProfileDto.phonenumber;
    await this.queryRunner.getUserRepository().save(user);
  }

  // Transaction
  async modifyUserAuth(
    modifyUserAuthDto: ModifyUserAuthDto,
    user: UserEntity,
  ): Promise<void> {
    user.Auth.email = modifyUserAuthDto.email;
    user.Auth.nickname = modifyUserAuthDto.nickname;
    user.Auth.password = modifyUserAuthDto.password;
    await this.queryRunner.getUserRepository().save(user);
  }

  // General
  async modifyUserEmail(email: string, user: UserEntity): Promise<void> {
    user.Auth.email = email;
    await this.queryRunner.getUserRepository().save(user);
  }

  // General
  async modifyUserNickname(nickname: string, user: UserEntity): Promise<void> {
    user.Auth.nickname = nickname;
    await this.queryRunner.getUserRepository().save(user);
  }

  // General
  async modifyUserPhonenumber(
    phonenumber: string,
    user: UserEntity,
  ): Promise<void> {
    user.Profile.phonenumber = phonenumber;
    await this.userRepository.save(user);
  }

  // General
  async modifyUserPassword(password: string, user: UserEntity): Promise<void> {
    user.Auth.password = password;
    await this.userRepository.save(user);
  }

  // General
  async deleteUser(id: string): Promise<void> {
    await this.queryRunner.getUserRepository().delete({ id });
  }
}
