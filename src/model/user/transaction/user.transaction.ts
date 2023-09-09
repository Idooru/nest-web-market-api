import { Injectable } from "@nestjs/common";
import { UserGeneralService } from "../services/user-general.service";
import { RegisterUserDto } from "../dtos/register-user.dto";
import { DataSource, QueryRunner } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { AdminUserEntity } from "../entities/admin-user.entity";
import { ClientUserEntity } from "../entities/client-user.entity";
import { UserProfileEntity } from "../entities/user-profile.entity";
import { UserAuthEntity } from "../entities/user-auth.entity";
import { UserRepositoryVO } from "./user-repository.vo";
import { RepositoryPayload } from "../interfaces/repository-payload";
import { TypeOrmException } from "src/common/errors/typeorm.exception";
import { ModifyUserDto } from "../dtos/modify-user.dto";
import { ErrorLoggerLibrary } from "src/common/lib/logger/error-logger.library";

@Injectable()
export class UserTransaction {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepositoryVO: UserRepositoryVO,
    private readonly userGeneralService: UserGeneralService,
    private readonly errorLoggerLibrary: ErrorLoggerLibrary,
  ) {}

  async init(queryRunner: QueryRunner): Promise<void> {
    const repositoryPayload: RepositoryPayload = {
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
      const user = await this.userGeneralService.createUserEntity(
        registerUserDto.role,
      );

      const authInfo = await this.userGeneralService.createUserBase(
        user,
        registerUserDto,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      this.errorLoggerLibrary.log({
        err,
        firstTitle: "Transaction",
        secondTitle: "Register",
        className: UserTransaction.name,
      });
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

    try {
      await this.userGeneralService.modifyUser(modifyUserDto, userId);

      await queryRunner.commitTransaction();
    } catch (err) {
      this.errorLoggerLibrary.log({
        err,
        firstTitle: "Transaction",
        secondTitle: "ModifyUser",
        className: UserTransaction.name,
      });
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }
}
