import { ApiProperty, PickType } from "@nestjs/swagger";
import { OrderEntity } from "../entities/order.entity";

export class OrderBodyDto extends PickType(OrderEntity, [
  "deliveryOption",
  "deliveryAddress",
] as const) {
  @ApiProperty({
    description: "주문 배송 옵션",
    example: "default",
    required: true,
    uniqueItems: false,
  })
  deliveryOption: "default" | "speed" | "safe";

  @ApiProperty({
    description: "주문 배송지",
    example: "경기도 하남시 신장동 569번지",
    required: true,
    uniqueItems: false,
  })
  deliveryAddress: string;
}
