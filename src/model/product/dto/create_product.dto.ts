import { ProductsEntity } from "../entities/product.entity";
import { PickType } from "@nestjs/swagger";

export class CreateProductDto extends PickType(ProductsEntity, [
  "name",
  "price",
  "origin",
  "type",
  "description",
  "Image",
  "StarRating",
] as const) {}
