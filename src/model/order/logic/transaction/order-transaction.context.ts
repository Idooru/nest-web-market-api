import { Injectable } from "@nestjs/common";
import { SearchCreateOrderDto } from "../../dto/search-create-order.dto";
import { OrderUpdateService } from "../../services/order-update.service";

@Injectable()
export class OrderTransactionContext {
  constructor(private readonly orderUpdateService: OrderUpdateService) {}

  public createOrderContext(dto: SearchCreateOrderDto): () => Promise<void> {
    const { clientId, orderBodyDto, clientUser, account, totalPrice, productQuantities } = dto;

    return async () => {
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
        accountId: account.id,
        balance: totalPrice,
      });

      await this.orderUpdateService.depositAdminBalance(productQuantities);
    };
  }
}
