import { CartBody } from "./cart-body.dto";

export class ModifyCartDto {
  public cartId: string;
  public productId: string;
  public body: CartBody;
}
