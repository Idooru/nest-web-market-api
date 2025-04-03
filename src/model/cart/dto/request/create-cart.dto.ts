import { CartBody } from "./cart-body.dto";
import { ProductEntity } from "../../../product/entities/product.entity";
import { ClientUserEntity } from "../../../user/entities/client-user.entity";

export class CreateCartDto {
  productId: string;
  clientUserId: string;
  body: CartBody;
}

export class CreateCartRowDto {
  public product: ProductEntity;
  public clientUser: ClientUserEntity;
  public body: CartBody;
}
