import { Injectable } from "@nestjs/common";
import { UserRepositoryVO } from "../logic/transaction/user-repository.vo";
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
import { UserProfileEntity } from "../entities/user-profile.entity";
import { UserAuthEntity } from "../entities/user-auth.entity";

@Injectable()
export class UserOperationRepository {
  constructor(
    private readonly queryRunner: UserRepositoryVO,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthRepository: Repository<UserAuthEntity>,
  ) {}

  // Transaction
  async createUserEntity(role: ["client", "admin"]): Promise<UserEntity> {
    return await this.queryRunner.userRepository.save({ role });
  }

  // Transaction
  async createClientUser(user: UserEntity): Promise<void> {
    await this.queryRunner.clientUserRepository.save({ User: user });
  }

  // Transaction
  async createAdminUser(user: UserEntity): Promise<void> {
    await this.queryRunner.adminUserRepository.save({ User: user });
  }

  // Transaction
  async createUserProfile(
    createUserProfileDto: CreateUserProfileDto,
  ): Promise<void> {
    await this.queryRunner.userProfileRepository.save({
      ...createUserProfileDto,
    });
  }

  // Transaction
  async createUserAuth(createUserAuthDto: CreateUserAuthDto): Promise<void> {
    await this.queryRunner.userAuthRepository.save({ ...createUserAuthDto });
  }

  // Transaction
  async modifyUserProfile(
    modifyUserProfileDto: ModifyUserProfileDto,
    id: string,
  ): Promise<void> {
    await this.queryRunner.userProfileRepository.update(id, {
      ...modifyUserProfileDto,
    });
  }

  // Transaction
  async modifyUserAuth(
    modifyUserAuthDto: ModifyUserAuthDto,
    id: string,
  ): Promise<void> {
    await this.queryRunner.userAuthRepository.update(id, {
      ...modifyUserAuthDto,
    });
  }

  // General
  async modifyUserEmail(email: string, id: string): Promise<void> {
    await this.userAuthRepository.update(id, { email });
  }

  // General
  async modifyUserNickname(nickname: string, id: string): Promise<void> {
    await this.userAuthRepository.update(id, { nickname });
  }

  // General
  async modifyUserPhonenumber(phonenumber: string, id: string): Promise<void> {
    await this.userProfileRepository.update(id, { phonenumber });
  }

  // General
  async modifyUserPassword(password: string, id: string): Promise<void> {
    await this.userAuthRepository.update(id, { password });
  }

  // General
  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete({ id });
  }
}
