import { ApiProperty, PickType } from "@nestjs/swagger";
import { OrderEntity } from "../../entities/order.entity";
import { DeliveryOption } from "../../types/delivery-option.type";

export class OrderBody extends PickType(OrderEntity, ["deliveryOption", "deliveryAddress"] as const) {
  @ApiProperty({
    description: "주문 배송 옵션",
    example: "default",
    required: true,
    uniqueItems: false,
  })
  deliveryOption: DeliveryOption;

  @ApiProperty({
    description: "주문 배송지",
    example: "경기도 하남시 신장동 569번지",
    required: true,
    uniqueItems: false,
  })
  deliveryAddress: string;
}
