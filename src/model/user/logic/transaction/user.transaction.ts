import { Injectable } from "@nestjs/common";
import { RegisterUserDto } from "../../dtos/register-user.dto";
import { TypeOrmException } from "src/common/errors/typeorm.exception";
import { ModifyUserDto } from "../../dtos/modify-user.dto";
import { EmailSenderLibrary } from "src/common/lib/email/email-sender.library";
import { loggerFactory } from "src/common/functions/logger.factory";
import { UserOperationService } from "../../services/user-operation.service";
import { UserQueryRunnerProvider } from "./user-query-runner.provider";

@Injectable()
export class UserTransaction {
  constructor(
    private readonly userQueryRunnerProvider: UserQueryRunnerProvider,
    private readonly userOperationService: UserOperationService,
    private readonly emailSenderLibrary: EmailSenderLibrary,
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
