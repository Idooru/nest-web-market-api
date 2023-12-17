import { ApiProperty, PickType } from "@nestjs/swagger";
import { CartEntity } from "../entities/cart.entity";

export class CartBodyDto extends PickType(CartEntity, [
  "deliveryOption",
  "quantity",
  "totalPrice",
] as const) {
  @ApiProperty({
    description: "배송 옵션",
    example: "default",
    required: true,
    uniqueItems: false,
  })
  deliveryOption: "default" | "speed" | "safe";

  @ApiProperty({
    description: "장바구니 상품 수량",
    example: 5,
    required: true,
    uniqueItems: false,
  })
  quantity: number;

  @ApiProperty({
    description: "장바구니 총금액",
    example: 5000,
    required: true,
    uniqueItems: false,
  })
  totalPrice: number;
}
