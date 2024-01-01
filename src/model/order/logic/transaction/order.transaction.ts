import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CartSearcher } from "../../../cart/logic/cart.searcher";
import { UserSearcher } from "../../../user/logic/user.searcher";
import { TransactionErrorHandler } from "../../../../common/lib/error-handler/transaction-error.handler";
import { OrderQueryRunnerProvider } from "./order-query-runner.provider";
import { OrderBodyDto } from "../../dto/order-body.dto";
import { OrderUpdateService } from "../../services/order-update.service";
import { loggerFactory } from "../../../../common/functions/logger.factory";
import { AccountSearcher } from "../../../account/logic/account.searcher";

@Injectable()
export class OrderTransaction {
  constructor(
    private readonly orderQueryRunnerProvider: OrderQueryRunnerProvider,
    private readonly userSearcher: UserSearcher,
    private readonly cartSearcher: CartSearcher,
    private readonly accountSearcher: AccountSearcher,
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

    if (!clientUser.User.Account.length) {
      const message = "해당 사용자의 계좌가 존재하지 않습니다.";
      loggerFactory("None Account").error(message);
      throw new NotFoundException(message);
    }

    const clientAccount = await this.accountSearcher.findMainAccountWithUserId(
      clientId,
    );

    const totalPrice = carts
      .map((cart) => cart.totalPrice)
      .reduce((acc, cur) => acc + cur, 0);

    if (clientAccount.balance < totalPrice) {
      const message =
        "해당 사용자의 계좌에 상품의 총 액수만큼 금액이 존재하지 않습니다.";
      loggerFactory("underflow balance").error(message);
      throw new ForbiddenException(message);
    }

    const productQuantities = carts.map((cart) => ({
      product: cart.Product,
      quantity: cart.quantity,
    }));

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

      await this.orderUpdateService.withdrawClientBalance({
        accountId: clientAccount.id,
        balance: totalPrice,
      });

      await this.orderUpdateService.depositAdminBalance(productQuantities);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.transactionErrorHandler.handle(err);
    } finally {
      await queryRunner.release();
    }
  }
}
