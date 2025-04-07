import { OrderBody } from "./order-body.dto";
import { ClientUserEntity } from "../../../user/entities/client-user.entity";

export class CreateOrderDto {
  public clientId: string;
  public body: OrderBody;
}

export class CreateOrderRowDto {
  public body: OrderBody;
  public totalPrice: number;
  public clientUser: ClientUserEntity;
  public hasSurtax: boolean;
}
