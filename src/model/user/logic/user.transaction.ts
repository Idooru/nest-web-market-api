import { Injectable } from "@nestjs/common";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { DataSource, QueryRunner } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { AdminUserEntity } from "../entities/admin-user.entity";
import { ClientUserEntity } from "../entities/client-user.entity";
import { UserProfileEntity } from "../entities/user-profile.entity";
import { UserAuthEntity } from "../entities/user-auth.entity";
import { UserRepositoryPayload, UserRepositoryVO } from "./user-repository.vo";
import { TypeOrmException } from "src/common/errors/typeorm.exception";
import { ModifyUserDto } from "../dtos/modify-user.dto";
import { EmailSenderLibrary } from "src/common/lib/email/email-sender.library";
import { UserSearcher } from "./user.searcher";
import { loggerFactory } from "src/common/functions/logger.factory";
import { UserOperationService } from "../services/user-operation.service";

@Injectable()
export class UserTransaction {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepositoryVO: UserRepositoryVO,
    private readonly userSearcher: UserSearcher,
    private readonly userOperationService: UserOperationService,
    private readonly emailSenderLibrary: EmailSenderLibrary,
  ) {}

  async init(queryRunner: QueryRunner): Promise<void> {
    const repositoryPayload: UserRepositoryPayload = {
      userRepository: queryRunner.manager.getRepository(UserEntity),
      adminUserRepository: queryRunner.manager.getRepository(AdminUserEntity),
      clientUserRepository: queryRunner.manager.getRepository(ClientUserEntity),
      userProfileRepository:
        queryRunner.manager.getRepository(UserProfileEntity),
      userAuthRepository: queryRunner.manager.getRepository(UserAuthEntity),
    };

    this.userRepositoryVO.setRepositoryPayload(repositoryPayload);
  }

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    this.init(queryRunner);

    try {
      const user = await this.userOperationService.createUserEntity(
        registerUserDto.role,
      );

      const authInfo = await this.userOperationService.createUserBase(
        user,
        registerUserDto,
      );

      // await this.emailSenderLibrary.sendMailToClientAboutRegister(authInfo);

      await queryRunner.commitTransaction();
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async modifyUser(
    modifyUserDto: ModifyUserDto,
    userId: string,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    this.init(queryRunner);

    const user = await this.userSearcher.findUserWithId(userId);

    try {
      await this.userOperationService.modifyUser(modifyUserDto, user);

      await queryRunner.commitTransaction();
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }
}
