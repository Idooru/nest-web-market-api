import { Injectable } from "@nestjs/common";
import { RegisterUserDto } from "../../dtos/register-user.dto";
import { TypeOrmException } from "src/common/errors/typeorm.exception";
import { ModifyUserDto } from "../../dtos/modify-user.dto";
import { loggerFactory } from "src/common/functions/logger.factory";
import { UserOperationService } from "../../services/user-operation.service";
import { UserQueryRunnerProvider } from "./user-query-runner.provider";
import { UserFunctionService } from "../../services/user-function.service";

@Injectable()
export class UserTransaction {
  constructor(
    private readonly userQueryRunnerProvider: UserQueryRunnerProvider,
    private readonly userOperationService: UserOperationService,
    private readonly userFunctionService: UserFunctionService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const queryRunner = await this.userQueryRunnerProvider.init();

    try {
      const user = await this.userOperationService.createUserEntity(
        registerUserDto.role,
      );

      const authInfo = await this.userOperationService.createUserBase(
        user,
        registerUserDto,
      );

      const emailWork =
        this.userFunctionService.getSendMailToClientAboutRegister(authInfo);

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
      await this.userOperationService.modifyUser(modifyUserDto, id);

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
