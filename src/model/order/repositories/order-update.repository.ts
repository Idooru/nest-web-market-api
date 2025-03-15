import { ForbiddenException, Injectable } from "@nestjs/common";
import { ProductEntity } from "../../product/entities/product.entity";
import { CartEntity } from "../../cart/entities/cart.entity";
import { CreateOrderRowDto } from "../dto/create-order.dto";
import { CreatePaymentDto } from "../dto/create-payment.dto";
import { OrderEntity } from "../entities/order.entity";
import { AccountEntity } from "../../account/entities/account.entity";
import { QueryFailedError } from "typeorm";
import { loggerFactory } from "../../../common/functions/logger.factory";
import { DepositAdminBalanceDto } from "../dto/deposit-admin-balance.dto";
import { Transactional } from "../../../common/interfaces/initializer/transactional";
import { OrderRepositoryPayload } from "../logic/transaction/order-repository.payload";
import { MoneyTransactionDto } from "../../account/dtos/money-transaction.dto";
import { Transaction } from "../../../common/decorators/transaction.decorator";
import { DecreaseProductStockDto } from "../dto/decrease-product-stock.dto";

@Injectable()
export class OrderUpdateRepository {
  constructor(private readonly transaction: Transactional<OrderRepositoryPayload>) {}

  @Transaction
  public async deleteAllCartsOnTransaction(id: string): Promise<void> {
    await this.transaction
      .getRepository()
      .cart.createQueryBuilder()
      .delete()
      .from(CartEntity)
      .where("clientId = :id", { id })
      .execute();
  }

  @Transaction
  public async decreaseProductStock(dto: DecreaseProductStockDto): Promise<void> {
    const { product, quantity } = dto;
    await this.transaction
      .getRepository()
      .product.createQueryBuilder()
      .update(ProductEntity)
      .set({ stock: () => `stock - ${quantity}` })
      .where("id = :id", { id: product.id })
      .execute();
  }

  @Transaction
  public createOrderRow(dto: CreateOrderRowDto): Promise<OrderEntity> {
    const { body, clientUser, totalPrice } = dto;
    const { deliveryOption, deliveryAddress } = body;

    return this.transaction.getRepository().order.save({
      deliveryOption,
      deliveryAddress,
      totalPrice,
      ClientUser: clientUser,
    });
  }

  @Transaction
  public async createPayment(dto: CreatePaymentDto): Promise<void> {
    const { clientUser, productQuantity, order } = dto;
    const { product, quantity } = productQuantity;
    const totalPrice = product.price * quantity;

    await this.transaction.getRepository().payment.save({
      totalPrice,
      quantity,
      ClientUser: clientUser,
      Order: order,
      Product: product,
    });
  }

  @Transaction
  public async withdrawClientBalance(dto: MoneyTransactionDto): Promise<AccountEntity> {
    const { accountId, balance } = dto;
    await this.transaction
      .getRepository()
      .account.createQueryBuilder()
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

    return this.transaction.getRepository().account.findOneBy({ id: accountId });
  }

  @Transaction
  public async depositAdminBalance(dto: DepositAdminBalanceDto): Promise<void> {
    const { userId, balance, totalPrice } = dto;
    const depositBalance = balance + totalPrice;

    await this.transaction
      .getRepository()
      .account.createQueryBuilder()
      .update(AccountEntity)
      .set({ balance: depositBalance })
      .where("userId = :userId", { userId })
      .execute();
  }
}
