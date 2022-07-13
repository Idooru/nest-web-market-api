import { PickType } from "@nestjs/mapped-types";
import { ProductEntity } from "../entities/product.entity";

export class ResponseProductDto extends PickType(ProductEntity, [
  "id",
  "name",
  "price",
  "origin",
  "type",
  "description",
  "Image",
  "createdAt",
  "updatedAt",
] as const) {}

export class ResponseProductsDto extends PickType(ProductEntity, [
  "name",
  "price",
  "type",
  "Image",
] as const) {}
