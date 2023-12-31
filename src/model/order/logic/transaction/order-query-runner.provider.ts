import { Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";
import { CartEntity } from "../../../cart/entities/cart.entity";
import { ProductEntity } from "../../../product/entities/product.entity";
import {
  OrderRepositoryPayload,
  OrderRepositoryVo,
} from "./order-repository.vo";
import { OrderEntity } from "../../entities/order.entity";
import { PaymentEntitiy } from "../../entities/payment.entitiy";

@Injectable()
export class OrderQueryRunnerProvider {
  constructor(
    private readonly dataSource: DataSource,
    private readonly orderRepositoryVo: OrderRepositoryVo,
  ) {}

  async init(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const repositoryPayload: OrderRepositoryPayload = {
      orderRepository: queryRunner.manager.getRepository(OrderEntity),
      cartRepository: queryRunner.manager.getRepository(CartEntity),
      productRepository: queryRunner.manager.getRepository(ProductEntity),
      paymentRepository: queryRunner.manager.getRepository(PaymentEntitiy),
    };
    this.orderRepositoryVo.setRepositoryPayload(repositoryPayload);

    return queryRunner;
  }
}
