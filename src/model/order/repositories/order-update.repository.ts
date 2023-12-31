import { Injectable } from "@nestjs/common";
import { ProductEntity } from "../../product/entities/product.entity";
import { CartEntity } from "../../cart/entities/cart.entity";
import { OrderRepositoryVo } from "../logic/transaction/order-repository.vo";
import { CreateOrderDto } from "../dto/create-order.dto";
import { CreatePaymentDto } from "../dto/create-payment.dto";
import { OrderEntity } from "../entities/order.entity";

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
    const { deliveryOption } = orderBodyDto;

    return await this.queryRunner.orderRepository.save({
      deliveryOption,
      ClientUser: clientUser,
      totalPrice,
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
}
