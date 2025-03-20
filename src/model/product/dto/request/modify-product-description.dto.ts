import { ApiProperty, PickType } from "@nestjs/swagger";
import { ProductEntity } from "../../entities/product.entity";

export class ModifyProductDesctiptionDto extends PickType(ProductEntity, ["description"] as const) {
  @ApiProperty({
    description: "상품 설명",
    example: "귀여운 고양이",
    required: false,
    uniqueItems: false,
  })
  description: string;
}
