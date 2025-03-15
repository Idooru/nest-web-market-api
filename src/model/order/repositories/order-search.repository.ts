import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "../entities/order.entity";
import { Repository } from "typeorm";
import { OrderSelect } from "../../../common/config/repository-select-configs/order.select";

@Injectable()
export class OrderSearchRepository {
  constructor(
    @Inject("order-select") private readonly select: OrderSelect,
    @InjectRepository(OrderEntity) private readonly repository: Repository<OrderEntity>,
  ) {}

  public findOrderRows(userId: string): Promise<OrderEntity[]> {
    return this.repository
      .createQueryBuilder()
      .select(this.select.order)
      .from(OrderEntity, "order")
      .innerJoin("order.Payment", "Payment")
      .innerJoin("Payment.Product", "PaymentProduct")
      .innerJoin("PaymentProduct.Image", "PaymentProductImage")
      .where("order.clientId = :userId", { userId })
      .getMany();
  }
}
