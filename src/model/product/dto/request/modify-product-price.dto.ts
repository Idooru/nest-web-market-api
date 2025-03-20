import { ApiProperty, PickType } from "@nestjs/swagger";
import { ProductEntity } from "../../entities/product.entity";

export class ModifyProductPriceDto extends PickType(ProductEntity, ["price"] as const) {
  @ApiProperty({
    description: "상품 가격",
    example: 5000,
    required: true,
    uniqueItems: false,
  })
  price: number;
}
