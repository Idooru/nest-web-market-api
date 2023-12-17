import { ProductEntity } from "../../product/entities/product.entity";
import { ClientUserEntity } from "../../user/entities/client-user.entity";

export class CreateCartDto {
  product: ProductEntity;
  clientUser: ClientUserEntity;
  quantity: number;
  totalPrice: number;
  deliveryOption: "default" | "speed" | "safe";
}
