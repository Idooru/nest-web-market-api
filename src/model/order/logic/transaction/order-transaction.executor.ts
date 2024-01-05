import { Injectable } from "@nestjs/common";
import { OrderBodyDto } from "../../dto/order-body.dto";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";
import { OrderRepositoryPayload } from "./order-repository.payload";
import { TransactionHandler } from "../../../../common/lib/handler/transaction.handler";
import { OrderTransactionSearcher } from "./order-transaction.searcher";
import { OrderTransactionContext } from "./order-transaction.context";

@Injectable()
export class OrderTransactionExecutor {
  constructor(
    private readonly transaction: Transactional<OrderRepositoryPayload>,
    private readonly handler: TransactionHandler,
    private readonly searcher: OrderTransactionSearcher,
    private readonly context: OrderTransactionContext,
  ) {}

  public async createOrder(createOrderDto: {
    clientId: string;
    orderBodyDto: OrderBodyDto;
  }) {
    const search = await this.searcher.searchCreateOrder(createOrderDto);
    const queryRunner = await this.transaction.init();

    await this.context
      .createOrderContext(search)()
      .then(() => this.handler.commit(queryRunner))
      .catch((err) => this.handler.rollback(queryRunner, err))
      .finally(() => this.handler.release(queryRunner));
  }
}
