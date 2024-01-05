import { Injectable } from "@nestjs/common";
import { RegisterUserDto } from "../../dtos/register-user.dto";
import { ModifyUserDto } from "../../dtos/modify-user.dto";
import { UserUpdateService } from "../../services/user-update.service";
import { TransactionErrorHandler } from "../../../../common/lib/transaction/transaction-error.handler";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";
import { UserRepositoryPayload } from "./user-repository.payload";

@Injectable()
export class UserTransaction {
  constructor(
    private readonly transaction: Transactional<UserRepositoryPayload>,
    private readonly userUpdateService: UserUpdateService,
    private readonly transactionErrorHandler: TransactionErrorHandler,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const queryRunner = await this.transaction.init();

    try {
      const user = await this.userUpdateService.createUserEntity(
        registerUserDto.role,
      );

      await this.userUpdateService.createUserBase(user, registerUserDto);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.transactionErrorHandler.handle(err);
    } finally {
      await queryRunner.release();
    }
  }

  async modifyUser(modifyUserDto: ModifyUserDto, id: string): Promise<void> {
    const queryRunner = await this.transaction.init();

    try {
      await this.userUpdateService.modifyUser(modifyUserDto, id);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.transactionErrorHandler.handle(err);
    } finally {
      await queryRunner.release();
    }
  }
}
