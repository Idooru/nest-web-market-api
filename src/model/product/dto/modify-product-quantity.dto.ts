import { PickType } from "@nestjs/swagger";
import { ProductEntity } from "../entities/product.entity";

export class ModifyProductQuantityDto extends PickType(ProductEntity, [
  "quantity",
] as const) {}
