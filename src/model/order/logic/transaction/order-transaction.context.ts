import { Injectable } from "@nestjs/common";
import { SearchCreateOrderDto } from "../../dto/search-create-order.dto";
import { OrderService } from "../../services/order.service";
import { CreateOrderRowDto } from "../../dto/create-order.dto";
import { CreatePaymentsDto } from "../../dto/create-payments.dto";
import { MoneyTransactionDto } from "../../../account/dtos/money-transaction.dto";

@Injectable()
export class OrderTransactionContext {
  constructor(private readonly orderService: OrderService) {}

  public async createOrderContext(dto: SearchCreateOrderDto): Promise<void> {
    const { clientId, body, clientUser, account, totalPrice, productQuantities } = dto;

    await Promise.all([
      this.orderService.deleteAllCarts(clientId),
      this.orderService.decreaseProductStocks(productQuantities),
    ]);

    const createOrderRowDto: CreateOrderRowDto = {
      body,
      totalPrice,
      clientUser,
    };

    const order = await this.orderService.createOrder(createOrderRowDto);

    const createPaymentsDto: CreatePaymentsDto = {
      productQuantities,
      clientUser,
      order,
    };

    await this.orderService.createPayments(createPaymentsDto);

    const moneyTransactionDto: MoneyTransactionDto = {
      accountId: account.id,
      balance: totalPrice,
    };

    await this.orderService.withdrawClientBalance(moneyTransactionDto);
    await this.orderService.depositAdminBalance(productQuantities);
  }
}
