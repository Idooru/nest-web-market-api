import { Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";
import { CartEntity } from "../../../cart/entities/cart.entity";
import { ProductEntity } from "../../../product/entities/product.entity";
import { OrderRepositoryPayload } from "./order-repository.payload";
import { OrderEntity } from "../../entities/order.entity";
import { PaymentEntitiy } from "../../entities/payment.entitiy";
import { AccountEntity } from "../../../account/entities/account.entity";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";

@Injectable()
export class OrderQueryRunnerProvider extends Transactional<OrderRepositoryPayload> {
  private payload: OrderRepositoryPayload;

  constructor(private readonly dataSource: DataSource) {
    super();
  }

  public async init(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    this.payload = {
      order: queryRunner.manager.getRepository(OrderEntity),
      cart: queryRunner.manager.getRepository(CartEntity),
      product: queryRunner.manager.getRepository(ProductEntity),
      payment: queryRunner.manager.getRepository(PaymentEntitiy),
      account: queryRunner.manager.getRepository(AccountEntity),
    };

    return queryRunner;
  }

  public getRepository(): OrderRepositoryPayload {
    return this.payload;
  }
}
