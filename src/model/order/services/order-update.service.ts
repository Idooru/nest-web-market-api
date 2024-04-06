import { Injectable } from "@nestjs/common";
import { ProductEntity } from "../../product/entities/product.entity";
import { CreateOrderDto } from "../dto/create-order.dto";
import { OrderUpdateRepository } from "../repositories/order-update.repository";
import { CreatePaymentsDto } from "../dto/create-payments.dto";
import { OrderEntity } from "../entities/order.entity";
import { DepositAdminBalanceDto } from "../dto/deposit-admin-balance.dto";
import { MoneyTransactionDto } from "../../account/dtos/money-transaction.dto";
import { Transaction } from "../../../common/decorators/transaction.decorator";

@Injectable()
export class OrderUpdateService {
  constructor(private readonly orderUpdateRepository: OrderUpdateRepository) {}

  @Transaction
  public async deleteAllCarts(id: string) {
    await this.orderUpdateRepository.deleteAllCartsOnTransaction(id);
  }

  @Transaction
  public async decreaseProductQuantities(
    productQuantities: { product: ProductEntity; quantity: number }[],
  ): Promise<void> {
    const decreasing = productQuantities.map((productQuantitiy) =>
      this.orderUpdateRepository.decreaseProductQuantity(productQuantitiy),
    );

    await Promise.all(decreasing);
  }

  @Transaction
  public createOrder(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    return this.orderUpdateRepository.createOrder(createOrderDto);
  }

  @Transaction
  public async createPayments(
    createPaymentsDto: CreatePaymentsDto,
  ): Promise<void> {
    const { productQuantities, clientUser, order } = createPaymentsDto;
    const creating = productQuantities.map((productQuantity) =>
      this.orderUpdateRepository.createPayment({
        productQuantity,
        clientUser,
        order,
      }),
    );

    await Promise.all(creating);
  }

  @Transaction
  public async withdrawClientBalance(
    withdrawDto: MoneyTransactionDto,
  ): Promise<void> {
    await this.orderUpdateRepository.withdrawClientBalance(withdrawDto);
  }

  @Transaction
  public async depositAdminBalance(
    productQuantities: { product: ProductEntity; quantity: number }[],
  ): Promise<void> {
    const adminUserBalances = productQuantities
      .map((productQuantity) => productQuantity.product.creater.User)
      .map((user) => ({ userId: user.id, balance: user.Account[0].balance }));

    const adminUserTotalPrice = productQuantities.map(
      ({ product, quantity }) => ({
        userId: product.creater.User.id,
        totalPrice: product.price * quantity,
      }),
    );

    const groups = [...adminUserBalances, ...adminUserTotalPrice].reduce(
      (result, item) => {
        const key = item.userId;

        if (!result[key]) {
          result[key] = {};
        }

        Object.assign(result[key], item);

        return result;
      },
      {},
    );

    const depositing = Object.values(groups).map(
      async (group: DepositAdminBalanceDto) =>
        await this.orderUpdateRepository.depositAdminBalance(group),
    );

    await Promise.all(depositing);
  }
}
