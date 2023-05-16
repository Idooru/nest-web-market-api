import { PickType } from "@nestjs/swagger";
import { ProductEntity } from "../entities/product.entity";

export class ModifyProducPriceDto extends PickType(ProductEntity, [
  "price",
] as const) {}
