import { ProductEntity } from "../../entities/product.entity";
import { ApiProperty, PickType } from "@nestjs/swagger";
import { ProductCategory } from "../../types/product-category.type";

export class ProductBody extends PickType(ProductEntity, [
  "name",
  "price",
  "origin",
  "category",
  "description",
  "stock",
] as const) {
  @ApiProperty({
    description: "상품 이름",
    example: "고양이",
    required: true,
    uniqueItems: true,
  })
  name: string;

  @ApiProperty({
    description: "상품 가격",
    example: 5000,
    required: true,
    uniqueItems: false,
  })
  price: number;

  @ApiProperty({
    description: "상품 원산지",
    example: "korea",
    required: true,
    uniqueItems: false,
  })
  origin: string;

  @ApiProperty({
    description: "상품 카테고리",
    example: "애완동물",
    required: true,
    uniqueItems: false,
  })
  category: ProductCategory;

  @ApiProperty({
    description: "상품 설명",
    example: "귀여운 고양이",
    required: false,
    uniqueItems: false,
  })
  description: string;

  @ApiProperty({
    description: "상품 수량",
    example: 50,
    required: false,
    uniqueItems: false,
  })
  stock: number;
}
