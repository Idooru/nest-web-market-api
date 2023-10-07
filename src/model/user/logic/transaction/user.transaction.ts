import { Injectable } from "@nestjs/common";
import { RegisterUserDto } from "../../dtos/register-user.dto";
import { TypeOrmException } from "src/common/errors/typeorm.exception";
import { ModifyUserDto } from "../../dtos/modify-user.dto";
import { loggerFactory } from "src/common/functions/logger.factory";
import { UserUpdateService } from "../../services/user-update.service";
import { UserQueryRunnerProvider } from "./user-query-runner.provider";
import { UserFactoryService } from "../../services/user-factory.service";

@Injectable()
export class UserTransaction {
  constructor(
    private readonly userQueryRunnerProvider: UserQueryRunnerProvider,
    private readonly userUpdateService: UserUpdateService,
    private readonly userFactoryService: UserFactoryService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const queryRunner = await this.userQueryRunnerProvider.init();

    try {
      const user = await this.userUpdateService.createUserEntity(
        registerUserDto.role,
      );

      const authInfo = await this.userUpdateService.createUserBase(
        user,
        registerUserDto,
      );

      const emailWork =
        this.userFactoryService.getSendMailToClientAboutRegister(authInfo);

      await emailWork();
      await queryRunner.commitTransaction();
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async modifyUser(modifyUserDto: ModifyUserDto, id: string): Promise<void> {
    const queryRunner = await this.userQueryRunnerProvider.init();

    try {
      await this.userUpdateService.modifyUser(modifyUserDto, id);

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
