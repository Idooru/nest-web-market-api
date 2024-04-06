import { Injectable } from "@nestjs/common";
import { RegisterUserDto } from "../../dtos/register-user.dto";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";
import { UserRepositoryPayload } from "./user-repository.payload";
import { TransactionHandler } from "../../../../common/lib/handler/transaction.handler";
import { UserTransactionContext } from "./user-transaction.context";
import { PrepareToModifyUserDto } from "../../dtos/prepare-to-modify-user.dto";

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

    this.context
      .registerContext(dto)()
      .then(() => this.handler.commit())
      .catch((err) => this.handler.rollback(err))
      .finally(() => this.handler.release());
  }

  public async modifyUser(dto: PrepareToModifyUserDto): Promise<void> {
    const queryRunner = await this.transaction.init();
    this.handler.setQueryRunner(queryRunner);

    this.context
      .modifyUserContext(dto)()
      .then(() => this.handler.commit())
      .catch((err) => this.handler.rollback(err))
      .finally(() => this.handler.release());
  }
}
