import { Injectable } from "@nestjs/common";
import { RegisterUserDto } from "../../dtos/register-user.dto";
import { ModifyUserDto } from "../../dtos/modify-user.dto";
import { UserUpdateService } from "../../services/user-update.service";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";
import { UserRepositoryPayload } from "./user-repository.payload";
import { TransactionHandler } from "../../../../common/lib/handler/transaction.handler";

@Injectable()
export class UserTransaction {
  constructor(
    private readonly transaction: Transactional<UserRepositoryPayload>,
    private readonly handler: TransactionHandler,
    private readonly userUpdateService: UserUpdateService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const queryRunner = await this.transaction.init();

    await (async () => {
      const user = await this.userUpdateService.createUserEntity(
        registerUserDto.role,
      );

      await this.userUpdateService.createUserBase(user, registerUserDto);
    })()
      .then(() => this.handler.commit(queryRunner))
      .catch((err) => this.handler.rollback(queryRunner, err))
      .finally(() => this.handler.release(queryRunner));
  }

  async modifyUser(modifyUserDto: ModifyUserDto, id: string): Promise<void> {
    const queryRunner = await this.transaction.init();

    await (() => this.userUpdateService.modifyUser(modifyUserDto, id))()
      .then(() => this.handler.commit(queryRunner))
      .catch((err) => this.handler.rollback(queryRunner, err))
      .finally(() => this.handler.release(queryRunner));
  }
}
