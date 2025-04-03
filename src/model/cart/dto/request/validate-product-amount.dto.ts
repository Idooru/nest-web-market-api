import { ProductEntity } from "../../product/entities/product.entity";
import { CartBody } from "./cart-body.dto";

export class ValidateProductAmountDto {
  product: ProductEntity;
  body: CartBody;
}
