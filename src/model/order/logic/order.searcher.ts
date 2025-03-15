import { Injectable } from "@nestjs/common";
import { OrderSearchRepository } from "../repositories/order-search.repository";
import { OrderEntity } from "../entities/order.entity";

@Injectable()
export class OrderSearcher {
  constructor(private readonly orderSearchRepository: OrderSearchRepository) {}

  public findOrders(userId: string): Promise<OrderEntity[]> {
    return this.orderSearchRepository.findOrderRows(userId);
  }
}
