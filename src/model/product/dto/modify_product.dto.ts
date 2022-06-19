import { ProductEntity } from "./../product.entity";
import { PickType } from "@nestjs/mapped-types";
import { CreateProductBody, CreateProductDto } from "./create_product.dto";

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
