import { ApiProperty, PickType } from "@nestjs/swagger";
import { ProductEntity } from "../../entities/product.entity";
import { ProductCategory } from "../../types/product-category.type";

export class ModifyProductCategoryDto extends PickType(ProductEntity, ["category"] as const) {
  @ApiProperty({
    description: "상품 카테고리",
    example: "애완동물",
    required: true,
    uniqueItems: false,
  })
  category: ProductCategory;
}
