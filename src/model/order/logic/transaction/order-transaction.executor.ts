import { Injectable } from "@nestjs/common";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";
import { OrderRepositoryPayload } from "./order-repository.payload";
import { TransactionHandler } from "../../../../common/lib/handler/transaction.handler";
import { OrderTransactionSearcher } from "./order-transaction.searcher";
import { OrderTransactionContext } from "./order-transaction.context";
import { CreateOrderDto } from "../../dto/request/create-order.dto";

@Injectable()
export class OrderTransactionExecutor {
  constructor(
    private readonly transaction: Transactional<OrderRepositoryPayload>,
    private readonly handler: TransactionHandler,
    private readonly searcher: OrderTransactionSearcher,
    private readonly context: OrderTransactionContext,
  ) {}

  public async createOrder(dto: CreateOrderDto): Promise<void> {
    const search = await this.searcher.searchCreateOrder(dto);
    const queryRunner = await this.transaction.init();
    this.handler.setQueryRunner(queryRunner);

    try {
      await this.context.createOrderContext(search);
      await this.handler.commit();
    } catch (err) {
      await this.handler.rollback(err);
    } finally {
      await this.handler.release();
    }
  }
}
