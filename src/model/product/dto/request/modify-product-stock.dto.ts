import { ApiProperty, PickType } from "@nestjs/swagger";
import { ProductEntity } from "../../entities/product.entity";

export class ModifyProductStockDto extends PickType(ProductEntity, ["stock"] as const) {
  @ApiProperty({
    description: "상품 수량",
    example: 50,
    required: false,
    uniqueItems: false,
  })
  stock: number;
}
