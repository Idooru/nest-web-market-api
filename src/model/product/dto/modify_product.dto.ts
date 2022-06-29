import { ProductEntity } from "./../product.entity";
import { PickType } from "@nestjs/swagger";

export class ModifyProductDto extends PickType(ProductEntity, [
  "name",
  "price",
  "origin",
  "type",
  "description",
  "image",
  "quantity",
] as const) {}
