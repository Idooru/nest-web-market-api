import { ClientUserEntity } from "../../../user/entities/client-user.entity";
import { OrderEntity } from "../../entities/order.entity";
import { ProductQuantity } from "../../types/product-quantity.type";

export class CreatePaymentsDto {
  public clientUser: ClientUserEntity;
  public order: OrderEntity;
  public productQuantities: Array<ProductQuantity>;
}
