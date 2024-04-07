import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { loggerFactory } from "../../../../common/functions/logger.factory";
import { OrderBodyDto } from "../../dto/order-body.dto";
import { UserSearcher } from "../../../user/logic/user.searcher";
import { CartSearcher } from "../../../cart/logic/cart.searcher";
import { AccountSearcher } from "../../../account/logic/account.searcher";
import { SearchCreateOrderDto } from "../../dto/search-create-order.dto";

@Injectable()
export class OrderTransactionSearcher {
  constructor(
    private readonly userSearcher: UserSearcher,
    private readonly cartSearcher: CartSearcher,
    private readonly accountSearcher: AccountSearcher,
  ) {}

  public async searchCreateOrder(dto: { clientId: string; orderBodyDto: OrderBodyDto }): Promise<SearchCreateOrderDto> {
    const { clientId, orderBodyDto } = dto;
    const [clientUser, carts] = await Promise.all([
      this.userSearcher.findClientUserObjectWithId(clientId),
      this.cartSearcher.findCartsWithUserId(clientId),
    ]);

    if (!clientUser.User.Account.length) {
      const message = "해당 사용자의 계좌가 존재하지 않습니다.";
      loggerFactory("None Account").error(message);
      throw new NotFoundException(message);
    }

    const account = await this.accountSearcher.findMainAccountWithUserId(clientId);
    const totalPrice = carts.map((cart) => cart.totalPrice).reduce((acc, cur) => acc + cur, 0);

    if (account.balance < totalPrice) {
      const message = "해당 사용자의 계좌에 상품의 총 액수만큼 금액이 존재하지 않습니다.";
      loggerFactory("underflow balance").error(message);
      throw new ForbiddenException(message);
    }

    const productQuantities = carts.map((cart) => ({
      product: cart.Product,
      quantity: cart.quantity,
    }));

    return {
      clientId,
      orderBodyDto,
      totalPrice,
      clientUser,
      productQuantities,
      account,
    };
  }
}
