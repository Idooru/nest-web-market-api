import { ForbiddenException, Injectable } from "@nestjs/common";
import { ProductEntity } from "../../product/entities/product.entity";
import { CartEntity } from "../../cart/entities/cart.entity";
import { OrderRepositoryVo } from "../logic/transaction/order-repository.vo";
import { CreateOrderDto } from "../dto/create-order.dto";
import { CreatePaymentDto } from "../dto/create-payment.dto";
import { OrderEntity } from "../entities/order.entity";
import { MoneyTransactionDto } from "../../account/dtos/money-transaction.dto";
import { AccountEntity } from "../../account/entities/account.entity";
import { QueryFailedError } from "typeorm";
import { loggerFactory } from "../../../common/functions/logger.factory";
import { DepositAdminBalanceDto } from "../dto/deposit-admin-balance.dto";

@Injectable()
export class OrderUpdateRepository {
  constructor(private readonly queryRunner: OrderRepositoryVo) {}

  // Transaction
  public async deleteAllCartsOnTransaction(id: string): Promise<void> {
    await this.queryRunner.cartRepository
      .createQueryBuilder()
      .delete()
      .from(CartEntity)
      .where("clientId = :id", { id })
      .execute();
  }

  // Transaction
  public async decreaseProductQuantity(productQuantity: {
    product: ProductEntity;
    quantity: number;
  }): Promise<void> {
    const { product, quantity } = productQuantity;
    await this.queryRunner.productRepository
      .createQueryBuilder()
      .update(ProductEntity)
      .set({ quantity: () => `quantity - ${quantity}` })
      .where("id = :id", { id: product.id })
      .execute();
  }

  // Transaction
  public async createOrder(
    createOrderDto: CreateOrderDto,
  ): Promise<OrderEntity> {
    const { orderBodyDto, clientUser, totalPrice } = createOrderDto;
    const { deliveryOption, deliveryAddress } = orderBodyDto;

    return await this.queryRunner.orderRepository.save({
      deliveryOption,
      deliveryAddress,
      totalPrice,
      ClientUser: clientUser,
    });
  }

  // Transaction
  public async createPayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<void> {
    const { clientUser, productQuantity, order } = createPaymentDto;
    const { product, quantity } = productQuantity;
    const totalPrice = product.price * quantity;

    await this.queryRunner.paymentRepository.save({
      totalPrice,
      quantity,
      ClientUser: clientUser,
      Order: order,
      Product: product,
    });
  }

  // Transaction
  public async withdrawClientBalance(withdrawDto: MoneyTransactionDto) {
    const { accountId, balance } = withdrawDto;
    await this.queryRunner.accountRepository
      .createQueryBuilder()
      .update(AccountEntity)
      .set({ balance: () => `balance - ${balance}` })
      .where("id = :id", { id: accountId })
      .execute()
      .catch((err: QueryFailedError) => {
        if (err.message.includes("BIGINT UNSIGNED value is out of range in")) {
          const message = "현재 잔액보다 더 많은 금액을 출금 할 수 없습니다.";
          loggerFactory("overflow withdraw").error(message);
          throw new ForbiddenException(message);
        }
      });

    return await this.queryRunner.accountRepository.findOneBy({
      id: accountId,
    });
  }

  // Transaction
  public async depositAdminBalance(
    depositDto: DepositAdminBalanceDto,
  ): Promise<void> {
    const { userId, balance, totalPrice } = depositDto;
    const depositBalance = balance + totalPrice;

    await this.queryRunner.accountRepository
      .createQueryBuilder()
      .update(AccountEntity)
      .set({ balance: depositBalance })
      .where("userId = :userId", { userId })
      .execute();
  }
}
