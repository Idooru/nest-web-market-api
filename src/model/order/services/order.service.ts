import { Injectable } from "@nestjs/common";
import { CreateOrderRowDto } from "../dto/create-order.dto";
import { OrderUpdateRepository } from "../repositories/order-update.repository";
import { CreatePaymentsDto } from "../dto/create-payments.dto";
import { OrderEntity } from "../entities/order.entity";
import { MoneyTransactionDto } from "../../account/dtos/money-transaction.dto";
import { Transaction } from "../../../common/decorators/transaction.decorator";
import { ProductQuantity } from "../types/product-quantity.type";
import { CreatePaymentDto } from "../dto/create-payment.dto";
import { AccountSearcher } from "../../account/logic/account.searcher";
import { DepositAdminBalanceDto } from "../dto/deposit-admin-balance.dto";

@Injectable()
export class OrderService {
  constructor(
    private readonly accountSearcher: AccountSearcher,
    private readonly orderUpdateRepository: OrderUpdateRepository,
  ) {}

  @Transaction
  public async deleteAllCarts(id: string) {
    await this.orderUpdateRepository.deleteAllCartsOnTransaction(id);
  }

  @Transaction
  public async decreaseProductStocks(productQuantities: Array<ProductQuantity>): Promise<void> {
    const decreasing = productQuantities.map((productQuantity: ProductQuantity) =>
      this.orderUpdateRepository.decreaseProductStock(productQuantity),
    );

    await Promise.all(decreasing);
  }

  @Transaction
  public createOrder(dto: CreateOrderRowDto): Promise<OrderEntity> {
    return this.orderUpdateRepository.createOrderRow(dto);
  }

  @Transaction
  public async createPayments(dto: CreatePaymentsDto): Promise<void> {
    const { productQuantities, clientUser, order } = dto;
    const creating = productQuantities.map((productQuantity) => {
      const createPaymentDto: CreatePaymentDto = {
        productQuantity,
        clientUser,
        order,
      };
      this.orderUpdateRepository.createPayment(createPaymentDto);
    });

    await Promise.all(creating);
  }

  @Transaction
  public async withdrawClientBalance(dto: MoneyTransactionDto): Promise<void> {
    await this.orderUpdateRepository.withdrawClientBalance(dto);
  }

  @Transaction
  public async depositAdminBalance(productQuantities: Array<ProductQuantity>): Promise<void> {
    const finding = productQuantities.map(async (productQuantity) => {
      const userId = productQuantity.product.creator.id;
      const mainAccount = await this.accountSearcher.findMainAccount(userId);
      const balance = mainAccount.balance;
      return { userId, balance };
    });

    const balances = await Promise.all(finding);
    const totalPrices = productQuantities.map(({ product, quantity }) => ({
      userId: product.creator.id,
      totalPrice: product.price * quantity,
    }));

    const map = new Map<string, { userId: string; balance: number; totalPrice: number }>();
    balances.forEach(({ userId, balance }) => map.set(userId, { userId, balance, totalPrice: 0 }));

    totalPrices.forEach(({ userId, totalPrice }) =>
      map.has(userId)
        ? (map.get(userId).totalPrice += totalPrice)
        : map.set(userId, { userId, balance: 0, totalPrice }),
    );

    const groups = Array.from(map.values());

    // const groups = [...balances, ...totalPrices].reduce((result, item) => {
    //   const key = item.userId;
    //
    //   if (!result[key]) {
    //     result[key] = {};
    //   }
    //
    //   Object.assign(result[key], item);
    //
    //   return result;
    // }, {});

    const depositing = Object.values(groups).map((group: DepositAdminBalanceDto) =>
      this.orderUpdateRepository.depositAdminBalance(group),
    );

    await Promise.all(depositing);
  }
}
