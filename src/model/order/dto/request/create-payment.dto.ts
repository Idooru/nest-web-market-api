import { ClientUserEntity } from "../../../user/entities/client-user.entity";
import { OrderEntity } from "../../entities/order.entity";
import { ProductQuantity } from "../../types/product-quantity.type";

export class CreatePaymentDto {
  public clientUser: ClientUserEntity;
  public order: OrderEntity;
  public productQuantity: ProductQuantity;
}
