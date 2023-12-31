import { Injectable } from "@nestjs/common";
import { CartSearcher } from "../../../cart/logic/cart.searcher";
import { UserSearcher } from "../../../user/logic/user.searcher";
import { TransactionErrorHandler } from "../../../../common/lib/error-handler/transaction-error.handler";
import { OrderQueryRunnerProvider } from "./order-query-runner.provider";
import { OrderBodyDto } from "../../dto/order-body.dto";
import { OrderUpdateService } from "../../services/order-update.service";

@Injectable()
export class OrderTransaction {
  constructor(
    private readonly orderQueryRunnerProvider: OrderQueryRunnerProvider,
    private readonly userSearcher: UserSearcher,
    private readonly cartSearcher: CartSearcher,
    private readonly orderUpdateService: OrderUpdateService,
    private readonly transactionErrorHandler: TransactionErrorHandler,
  ) {}

  public async createOrder(createOrderDto: {
    clientId: string;
    orderBodyDto: OrderBodyDto;
  }) {
    const { clientId, orderBodyDto } = createOrderDto;
    const [clientUser, carts] = await Promise.all([
      this.userSearcher.findClientUserObjectWithId(clientId),
      this.cartSearcher.findCartsWithUserId(clientId),
    ]);

    const productQuantities = carts.map((cart) => ({
      product: cart.Product,
      quantity: cart.quantity,
    }));

    const totalPrice = carts
      .map((cart) => cart.totalPrice)
      .reduce((acc, cur) => acc + cur, 0);

    const queryRunner = await this.orderQueryRunnerProvider.init();

    try {
      await Promise.all([
        this.orderUpdateService.deleteAllCarts(clientId),
        this.orderUpdateService.decreaseProductQuantities(productQuantities),
      ]);

      const order = await this.orderUpdateService.createOrder({
        orderBodyDto,
        totalPrice,
        clientUser,
      });

      await this.orderUpdateService.createPayments({
        productQuantities,
        clientUser,
        order,
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.transactionErrorHandler.handle(err);
    } finally {
      await queryRunner.release();
    }
  }
}
