import { OrderBody } from "./order-body.dto";
import { ClientUserEntity } from "../../user/entities/client-user.entity";
import { AccountEntity } from "../../account/entities/account.entity";
import { ProductQuantity } from "../types/product-quantity.type";

export class SearchCreateOrderDto {
  clientId: string;
  body: OrderBody;
  totalPrice: number;
  clientUser: ClientUserEntity;
  productQuantities: Array<ProductQuantity>;
  account: AccountEntity;
}
