import { ApiProperty, PickType } from "@nestjs/swagger";
import { ProductEntity } from "../../entities/product.entity";

export class ModifyProductNameDto extends PickType(ProductEntity, ["name"] as const) {
  @ApiProperty({
    description: "상품 이름",
    example: "고양이",
    required: true,
    uniqueItems: true,
  })
  name: string;
}
