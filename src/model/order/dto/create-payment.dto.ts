import { ProductEntity } from "../../product/entities/product.entity";
import { ClientUserEntity } from "../../user/entities/client-user.entity";
import { OrderEntity } from "../entities/order.entity";

export class CreatePaymentDto {
  clientUser: ClientUserEntity;
  order: OrderEntity;
  productQuantity: { product: ProductEntity; quantity: number };
}
