import { Injectable } from "@nestjs/common";
import { SearchCreateOrderDto } from "../../dto/search-create-order.dto";
import { OrderService } from "../../services/order.service";

@Injectable()
export class OrderTransactionContext {
  constructor(private readonly orderService: OrderService) {}

  public createOrderContext(dto: SearchCreateOrderDto): () => Promise<void> {
    const { clientId, orderBodyDto, clientUser, account, totalPrice, productQuantities } = dto;

    return async () => {
      await Promise.all([
        this.orderService.deleteAllCarts(clientId),
        this.orderService.decreaseProductQuantities(productQuantities),
      ]);

      const order = await this.orderService.createOrder({
        orderBodyDto,
        totalPrice,
        clientUser,
      });

      await this.orderService.createPayments({
        productQuantities,
        clientUser,
        order,
      });

      await this.orderService.withdrawClientBalance({
        accountId: account.id,
        balance: totalPrice,
      });

      await this.orderService.depositAdminBalance(productQuantities);
    };
  }
}
