import { CartBodyDto } from "./cart-body.dto";

export class ModifyCartDto {
  public cartId: string;
  public productId: string;
  public cartBodyDto: CartBodyDto;
}
