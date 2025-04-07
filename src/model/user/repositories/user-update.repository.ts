import { Injectable } from "@nestjs/common";
import { UserRepositoryPayload } from "../logic/transaction/user-repository.payload";
import { UserEntity } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserProfileEntity } from "../entities/user-profile.entity";
import { UserAuthEntity } from "../entities/user-auth.entity";
import { Transactional } from "../../../common/interfaces/initializer/transactional";
import { Transaction } from "../../../common/decorators/transaction.decorator";
import { General } from "../../../common/decorators/general.decoration";
import { UserRole } from "../types/user-role.type";
import { CreateUserAuthDto, CreateUserProfileDto } from "../dto/request/register-user.dto";
import { ModifyUserAuthDto, ModifyUserProfileDto } from "../dto/request/modify-user.dto";

@Injectable()
export class UserUpdateRepository {
  constructor(
    private readonly transaction: Transactional<UserRepositoryPayload>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserAuthEntity)
    private readonly userAuthRepository: Repository<UserAuthEntity>,
  ) {}

  @Transaction
  public createUserEntity(role: UserRole): Promise<UserEntity> {
    return this.transaction.getRepository().user.save({ role });
  }

  @Transaction
  public async createClientUser(user: UserEntity): Promise<void> {
    await this.transaction.getRepository().clientUser.save({ User: user });
  }

  @Transaction
  public async createAdminUser(user: UserEntity): Promise<void> {
    await this.transaction.getRepository().adminUser.save({ User: user });
  }

  @Transaction
  public async createUserProfile(dto: CreateUserProfileDto): Promise<void> {
    await this.transaction.getRepository().userProfile.save(dto);
  }

  @Transaction
  public async createUserAuth(dto: CreateUserAuthDto): Promise<void> {
    await this.transaction.getRepository().userAuth.save(dto);
  }

  @Transaction
  public async modifyUserProfile(dto: ModifyUserProfileDto, id: string): Promise<void> {
    await this.transaction.getRepository().userProfile.update(id, dto);
  }

  @Transaction
  public async modifyUserAuth(dto: ModifyUserAuthDto, id: string): Promise<void> {
    await this.transaction.getRepository().userAuth.update(id, dto);
  }

  @General
  public async modifyUserEmail(email: string, id: string): Promise<void> {
    await this.userAuthRepository.update(id, { email });
  }

  @General
  public async modifyUserNickname(nickName: string, id: string): Promise<void> {
    await this.userAuthRepository.update(id, { nickName });
  }

  @General
  public async modifyUserPhoneNumber(phoneNumber: string, id: string): Promise<void> {
    await this.userProfileRepository.update(id, { phoneNumber });
  }

  @General
  public async modifyUserPassword(password: string, id: string): Promise<void> {
    await this.userAuthRepository.update(id, { password });
  }

  @General
  public async modifyUserAddress(address: string, id: string): Promise<void> {
    await this.userProfileRepository.update(id, { address });
  }

  @General
  public async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete({ id });
  }

  @General
  public async setRefreshToken(id: string, refreshToken: string): Promise<void> {
    await this.userAuthRepository.update(id, { refreshToken });
  }

  @General
  public async removeRefreshToken(id: string): Promise<void> {
    await this.userAuthRepository.update(id, { refreshToken: null });
  }
}
