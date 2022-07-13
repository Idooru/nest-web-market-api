import { ProductEntity } from "../entities/product.entity";
import { PickType } from "@nestjs/swagger";

export class ModifyProductDto extends PickType(ProductEntity, [
  "name",
  "price",
  "origin",
  "type",
  "description",
  "Image",
  "quantity",
] as const) {}
