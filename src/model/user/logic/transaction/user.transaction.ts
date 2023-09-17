import { Injectable } from "@nestjs/common";
import { RegisterUserDto } from "../../dtos/register-user.dto";
import { TypeOrmException } from "src/common/errors/typeorm.exception";
import { ModifyUserDto } from "../../dtos/modify-user.dto";
import { EmailSenderLibrary } from "src/common/lib/email/email-sender.library";
import { loggerFactory } from "src/common/functions/logger.factory";
import { UserOperationService } from "../../services/user-operation.service";
import { UserValidator } from "./user.validator";
import { UserInit } from "./user.init";

@Injectable()
export class UserTransaction {
  constructor(
    private readonly userInit: UserInit,
    private readonly userValidator: UserValidator,
    private readonly userOperationService: UserOperationService,
    private readonly emailSenderLibrary: EmailSenderLibrary,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const queryRunner = await this.userInit.init();
    const { email, nickname, phonenumber } = registerUserDto;

    await this.userValidator.validate({
      email,
      nickname,
      phonenumber,
    });

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
    const queryRunner = await this.userInit.init();

    const { email, nickname, phonenumber } = modifyUserDto;

    await this.userValidator.validate({
      email,
      nickname,
      phonenumber,
    });

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
