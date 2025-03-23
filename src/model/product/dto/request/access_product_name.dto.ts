import { PickType } from "@nestjs/swagger";
import { ProductEntity } from "../../entities/product.entity";

export class AccessProductNameDto extends PickType(ProductEntity, ["name"] as const) {
  public name: string;
}
