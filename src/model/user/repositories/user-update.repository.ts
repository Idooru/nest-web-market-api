import { Injectable } from "@nestjs/common";
import { UserRepositoryPayload } from "../logic/transaction/user-repository.payload";
import { UserEntity } from "../entities/user.entity";
import { CreateUserAuthDto, CreateUserProfileDto } from "../dtos/register-user.dto";
import { ModifyUserAuthDto, ModifyUserProfileDto } from "../dtos/modify-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserProfileEntity } from "../entities/user-profile.entity";
import { UserAuthEntity } from "../entities/user-auth.entity";
import { Transactional } from "../../../common/interfaces/initializer/transactional";
import { Transaction } from "../../../common/decorators/transaction.decorator";
import { General } from "../../../common/decorators/general.decoration";

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
  public createUserEntity(role: ["client", "admin"]): Promise<UserEntity> {
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
  public async createUserProfile(createUserProfileDto: CreateUserProfileDto): Promise<void> {
    await this.transaction.getRepository().userProfile.save({
      ...createUserProfileDto,
    });
  }

  @Transaction
  public async createUserAuth(createUserAuthDto: CreateUserAuthDto): Promise<void> {
    await this.transaction.getRepository().userAuth.save({ ...createUserAuthDto });
  }

  @Transaction
  public async modifyUserProfile(modifyUserProfileDto: ModifyUserProfileDto, id: string): Promise<void> {
    await this.transaction.getRepository().userProfile.update(id, {
      ...modifyUserProfileDto,
    });
  }

  @Transaction
  public async modifyUserAuth(modifyUserAuthDto: ModifyUserAuthDto, id: string): Promise<void> {
    await this.transaction.getRepository().userAuth.update(id, {
      ...modifyUserAuthDto,
    });
  }

  @General
  public async modifyUserEmail(email: string, id: string): Promise<void> {
    await this.userAuthRepository.update(id, { email });
  }

  @General
  public async modifyUserNickname(nickname: string, id: string): Promise<void> {
    await this.userAuthRepository.update(id, { nickname });
  }

  @General
  public async modifyUserPhonenumber(phonenumber: string, id: string): Promise<void> {
    await this.userProfileRepository.update(id, { phonenumber });
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
}
