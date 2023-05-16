import { PickType } from "@nestjs/swagger";
import { ProductEntity } from "../entities/product.entity";

export class ModifyProductQuantity extends PickType(ProductEntity, [
  "quantity",
] as const) {}
