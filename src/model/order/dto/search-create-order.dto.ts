import { OrderBodyDto } from "./order-body.dto";
import { ClientUserEntity } from "../../user/entities/client-user.entity";
import { ProductEntity } from "../../product/entities/product.entity";
import { AccountEntity } from "../../account/entities/account.entity";

export class SearchCreateOrderDto {
  clientId: string;
  orderBodyDto: OrderBodyDto;
  totalPrice: number;
  clientUser: ClientUserEntity;
  productQuantities: { product: ProductEntity; quantity: number }[];
  account: AccountEntity;
}
