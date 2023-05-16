import { PickType } from "@nestjs/swagger";
import { ProductEntity } from "../entities/product.entity";

export class ModifyProductOriginDto extends PickType(ProductEntity, [
  "origin",
] as const) {}
