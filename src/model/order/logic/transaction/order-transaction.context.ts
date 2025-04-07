import { Injectable } from "@nestjs/common";
import { OrderService } from "../../services/order.service";
import { SearchCreateOrderDto } from "../../dto/request/search-create-order.dto";
import { CreateOrderRowDto } from "../../dto/request/create-order.dto";
import { CreatePaymentsDto } from "../../dto/request/create-payments.dto";
import { WithdrawClientBalanceDto } from "../../dto/request/withdraw-client-balance.dto";
import { DepositAdminBalanceDto } from "../../dto/request/deposit-admin-balance.dto";

@Injectable()
export class OrderTransactionContext {
  constructor(private readonly orderService: OrderService) {}

  public async createOrderContext(dto: SearchCreateOrderDto): Promise<void> {
    const { clientId, body, clientUser, account, totalPrice, productQuantities, hasSurtax } = dto;

    await Promise.all([
      this.orderService.deleteAllCarts(clientId),
      this.orderService.decreaseProductStocks(productQuantities),
    ]);

    const withdrawClientBalanceDto: WithdrawClientBalanceDto = {
      accountId: account.id,
      balance: totalPrice,
      hasSurtax,
    };

    const depositAdminBalanceDto: DepositAdminBalanceDto = {
      productQuantities,
      hasSurtax,
    };

    await this.orderService.withdrawClientBalance(withdrawClientBalanceDto);
    await this.orderService.depositAdminBalance(depositAdminBalanceDto);

    const createOrderRowDto: CreateOrderRowDto = {
      body,
      totalPrice,
      clientUser,
      hasSurtax,
    };

    const order = await this.orderService.createOrder(createOrderRowDto);

    const createPaymentsDto: CreatePaymentsDto = {
      productQuantities,
      clientUser,
      order,
    };

    await this.orderService.createPayments(createPaymentsDto);
  }
}
