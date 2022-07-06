import { ProductEntity } from "../entities/product.entity";
import { PickType } from "@nestjs/swagger";

export class CreateProductDto extends PickType(ProductEntity, [
  "name",
  "price",
  "origin",
  "type",
  "description",
  "image",
  "starRating",
] as const) {}
