import { Injectable } from "@nestjs/common";
import { ProductEntity } from "../../product/entities/product.entity";
import { CreateOrderDto } from "../dto/create-order.dto";
import { OrderUpdateRepository } from "../repositories/order-update.repository";
import { CreatePaymentsDto } from "../dto/create-payments.dto";
import { OrderEntity } from "../entities/order.entity";

@Injectable()
export class OrderUpdateService {
  constructor(private readonly orderUpdateRepository: OrderUpdateRepository) {}

  // Transaction
  public async deleteAllCarts(id: string) {
    await this.orderUpdateRepository.deleteAllCartsOnTransaction(id);
  }

  // Transaction
  public async decreaseProductQuantities(
    productQuantities: { product: ProductEntity; quantity: number }[],
  ): Promise<void> {
    const decreasing = productQuantities.map((productQuantitiy) =>
      this.orderUpdateRepository.decreaseProductQuantity(productQuantitiy),
    );

    await Promise.all(decreasing);
  }

  // Transaction
  public async createOrder(
    createOrderDto: CreateOrderDto,
  ): Promise<OrderEntity> {
    return await this.orderUpdateRepository.createOrder(createOrderDto);
  }

  // Transaction
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
}
