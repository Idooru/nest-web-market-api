import { PickType } from "@nestjs/swagger";
import { ProductEntity } from "../entities/product.entity";

export class ModifyProductDesctiptionDto extends PickType(ProductEntity, [
  "description",
] as const) {}
