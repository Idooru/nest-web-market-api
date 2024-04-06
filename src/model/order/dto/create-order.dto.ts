import { OrderBodyDto } from "./order-body.dto";
import { ClientUserEntity } from "../../user/entities/client-user.entity";

export class CreateOrderDto {
  public orderBodyDto: OrderBodyDto;
  public totalPrice: number;
  public clientUser: ClientUserEntity;
}
