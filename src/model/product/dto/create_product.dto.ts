import { ProductEntity } from "./../product.entity";
import { PickType } from "@nestjs/mapped-types";

export class CreateProductBody extends PickType(ProductEntity, [
  "name",
  "price",
  "origin",
  "type",
  "description",
] as const) {}

export class CreateProductDto extends PickType(ProductEntity, [
  "name",
  "price",
  "origin",
  "type",
  "description",
  "imgUrl",
] as const) {}
