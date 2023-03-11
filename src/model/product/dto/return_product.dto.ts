import { PickType } from "@nestjs/swagger";
import { ProductEntity } from "../entities/product.entity";

export class ReturnProductsDto extends PickType(ProductEntity, [
  "id",
  "name",
  "type",
] as const) {}
