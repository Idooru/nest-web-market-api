import { ApiProperty, PickType } from "@nestjs/swagger";
import { ProductEntity } from "../entities/product.entity";

export class AccessProductNameDto extends PickType(ProductEntity, ["name"] as const) {
  @ApiProperty({
    description: "상품 이름",
    example: "자전거",
    required: true,
    uniqueItems: false,
  })
  public name: string;
}
