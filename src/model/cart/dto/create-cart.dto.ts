import { ProductEntity } from "../../product/entities/product.entity";
import { ClientUserEntity } from "../../user/entities/client-user.entity";
import { CartBodyDto } from "./cart-body.dto";

export class CreateCartDto {
  product: ProductEntity;
  clientUser: ClientUserEntity;
  cartBodyDto: CartBodyDto;
}
