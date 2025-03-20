import { ApiProperty, PickType } from "@nestjs/swagger";
import { ProductEntity } from "../../entities/product.entity";

export class ModifyProductOriginDto extends PickType(ProductEntity, ["origin"] as const) {
  @ApiProperty({
    description: "상품 원산지",
    example: "korea",
    required: true,
    uniqueItems: false,
  })
  origin: string;
}
