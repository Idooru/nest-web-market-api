import { ApiProperty, PickType } from "@nestjs/swagger";
import { CartEntity } from "../../entities/cart.entity";

export class CartBody extends PickType(CartEntity, ["quantity", "totalPrice"] as const) {
  @ApiProperty({
    description: "장바구니 상품 수량",
    example: 5,
    required: true,
    uniqueItems: false,
  })
  public quantity: number;

  @ApiProperty({
    description: "장바구니 총금액",
    example: 5000,
    required: true,
    uniqueItems: false,
  })
  public totalPrice: number;
}
