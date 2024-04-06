import { ProductEntity } from "../../product/entities/product.entity";
import { ClientUserEntity } from "../../user/entities/client-user.entity";
import { OrderEntity } from "../entities/order.entity";

export class CreatePaymentsDto {
  public clientUser: ClientUserEntity;
  public order: OrderEntity;
  public productQuantities: { product: ProductEntity; quantity: number }[];
}
