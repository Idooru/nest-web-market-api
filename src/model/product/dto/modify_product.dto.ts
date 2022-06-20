import { ProductEntity } from "./../product.entity";
import { PickType } from "@nestjs/swagger";

export class ModifyProductBody extends PickType(ProductEntity, [
  "name",
  "price",
  "origin",
  "type",
  "description",
  "quantity",
] as const) {}

export class ModifyProductDto extends PickType(ProductEntity, [
  "name",
  "price",
  "origin",
  "type",
  "description",
  "imgUrl",
  "quantity",
] as const) {}
