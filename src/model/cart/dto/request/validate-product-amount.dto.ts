import { CartBody } from "./cart-body.dto";
import { ProductEntity } from "../../../product/entities/product.entity";

export class ValidateProductAmountDto {
  product: ProductEntity;
  body: CartBody;
}
