import { Injectable } from "@nestjs/common";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";
import { UserRepositoryPayload } from "./user-repository.payload";
import { TransactionHandler } from "../../../../common/lib/handler/transaction.handler";
import { UserTransactionContext } from "./user-transaction.context";
import { RegisterUserDto } from "../../dto/request/register-user.dto";
import { ModifyUserDto } from "../../dto/request/modify-user.dto";

@Injectable()
export class UserTransactionExecutor {
  constructor(
    private readonly transaction: Transactional<UserRepositoryPayload>,
    private readonly handler: TransactionHandler,
    private readonly context: UserTransactionContext,
  ) {}

  public async register(dto: RegisterUserDto): Promise<void> {
    const queryRunner = await this.transaction.init();
    this.handler.setQueryRunner(queryRunner);

    try {
      await this.context.registerContext(dto);
      await this.handler.commit();
    } catch (err) {
      await this.handler.rollback(err);
    } finally {
      await this.handler.release();
    }
  }

  public async modifyUser(dto: ModifyUserDto): Promise<void> {
    const queryRunner = await this.transaction.init();
    this.handler.setQueryRunner(queryRunner);

    try {
      await this.context.modifyUserContext(dto);
      await this.handler.commit();
    } catch (err) {
      await this.handler.rollback(err);
    } finally {
      await this.handler.release();
    }
  }
}
