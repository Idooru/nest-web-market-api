import { PickType } from "@nestjs/mapped-types";
import { ProductEntity } from "../product.entity";
export class ResponseProductDto extends PickType(ProductEntity, [
  "name",
  "price",
  "origin",
  "type",
  "description",
  "imgUrl",
  "rating",
] as const) {}

export const productFilter = (product: ProductEntity) => ({
  productName: product.name,
  price: product.price,
});
