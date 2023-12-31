import { CartBodyDto } from "./cart-body.dto";

export class ModifyCartDto {
  cartId: string;
  productId: string;
  cartBodyDto: CartBodyDto;
}
