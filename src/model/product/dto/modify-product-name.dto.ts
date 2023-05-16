import { PickType } from "@nestjs/swagger";
import { ProductEntity } from "../entities/product.entity";

export class ModifyProductNameDto extends PickType(ProductEntity, [
  "name",
] as const) {}
