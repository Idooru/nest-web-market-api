import { OrderBodyDto } from "./order-body.dto";
import { ClientUserEntity } from "../../user/entities/client-user.entity";

export class CreateOrderDto {
  orderBodyDto: OrderBodyDto;
  totalPrice: number;
  clientUser: ClientUserEntity;
}
